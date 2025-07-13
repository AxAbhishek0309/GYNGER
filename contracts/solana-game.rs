use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod gynger_game {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        game_state.authority = ctx.accounts.authority.key();
        game_state.token_price = 1000000; // 0.001 SOL in lamports
        game_state.max_supply = 1000000 * 10u64.pow(9); // 1 billion tokens
        game_state.total_supply = 0;
        Ok(())
    }

    pub fn purchase_tokens(ctx: Context<PurchaseTokens>, amount: u64) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        let buyer = &ctx.accounts.buyer;
        let buyer_token_account = &ctx.accounts.buyer_token_account;
        let mint = &ctx.accounts.mint;
        let token_program = &ctx.accounts.token_program;

        // Calculate tokens to mint based on SOL amount
        let tokens_to_mint = (amount * 10u64.pow(9)) / game_state.token_price;
        
        require!(
            game_state.total_supply + tokens_to_mint <= game_state.max_supply,
            GameError::ExceedsMaxSupply
        );

        // Mint tokens to buyer
        let cpi_accounts = token::MintTo {
            mint: mint.to_account_info(),
            to: buyer_token_account.to_account_info(),
            authority: &ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::mint_to(cpi_ctx, tokens_to_mint)?;

        game_state.total_supply += tokens_to_mint;

        emit!(TokensPurchased {
            buyer: buyer.key(),
            amount: tokens_to_mint,
            cost: amount,
        });

        Ok(())
    }

    pub fn play_game(ctx: Context<PlayGame>, bet_amount: u64, player_choice: bool) -> Result<()> {
        let game_state = &mut ctx.accounts.game_state;
        let player = &ctx.accounts.player;
        let player_token_account = &ctx.accounts.player_token_account;
        let mint = &ctx.accounts.mint;
        let token_program = &ctx.accounts.token_program;

        // Generate random number (use VRF in production)
        let clock = Clock::get()?;
        let random_seed = clock.unix_timestamp as u64 + player.key().as_ref()[0] as u64;
        let coin_result = random_seed % 2 == 1;
        let won = player_choice == coin_result;

        if won {
            // Mint winning amount
            let win_amount = bet_amount * 2;
            let cpi_accounts = token::MintTo {
                mint: mint.to_account_info(),
                to: player_token_account.to_account_info(),
                authority: &ctx.accounts.authority.to_account_info(),
            };
            let cpi_program = token_program.to_account_info();
            let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
            token::mint_to(cpi_ctx, win_amount)?;
        } else {
            // Burn bet amount
            let cpi_accounts = token::Burn {
                mint: mint.to_account_info(),
                from: player_token_account.to_account_info(),
                authority: &ctx.accounts.authority.to_account_info(),
            };
            let cpi_program = token_program.to_account_info();
            let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
            token::burn(cpi_ctx, bet_amount)?;
        }

        // Update player stats
        let player_stats = &mut ctx.accounts.player_stats;
        player_stats.total_games += 1;
        if won {
            player_stats.total_wins += 1;
        }

        emit!(GamePlayed {
            player: player.key(),
            won,
            bet_amount,
            win_amount: if won { bet_amount * 2 } else { 0 },
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + GameState::INIT_SPACE
    )]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PurchaseTokens<'info> {
    #[account(mut)]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub mint: Account<'info, token::Mint>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlayGame<'info> {
    #[account(mut)]
    pub game_state: Account<'info, GameState>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub mint: Account<'info, token::Mint>,
    #[account(
        init_if_needed,
        payer = player,
        space = 8 + PlayerStats::INIT_SPACE
    )]
    pub player_stats: Account<'info, PlayerStats>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct GameState {
    pub authority: Pubkey,
    pub token_price: u64,
    pub max_supply: u64,
    pub total_supply: u64,
}

#[account]
#[derive(InitSpace)]
pub struct PlayerStats {
    pub player: Pubkey,
    pub total_wins: u64,
    pub total_games: u64,
    pub balance: u64,
}

#[event]
pub struct TokensPurchased {
    pub buyer: Pubkey,
    pub amount: u64,
    pub cost: u64,
}

#[event]
pub struct GamePlayed {
    pub player: Pubkey,
    pub won: bool,
    pub bet_amount: u64,
    pub win_amount: u64,
}

#[error_code]
pub enum GameError {
    #[msg("Exceeds maximum supply")]
    ExceedsMaxSupply,
} 