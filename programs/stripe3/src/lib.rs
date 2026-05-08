use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};

declare_id!("9FMFBdiH5dY91hUZ9sz4qqLRKTZhR7v29YPAnnU3VvcW");

#[program]
pub mod stripe3 {
    use super::*;

    pub fn create_product(
        ctx: Context<CreateProduct>,
        product_id: String,
        price_lamports: u64,
    ) -> Result<()> {
        require!(
            !product_id.is_empty() && product_id.len() <= Product::MAX_ID_LEN,
            Stripe3Error::InvalidProductId
        );
        require!(price_lamports > 0, Stripe3Error::InvalidPrice);

        let product = &mut ctx.accounts.product;
        product.merchant = ctx.accounts.merchant.key();
        product.product_id = product_id.clone();
        product.price_lamports = price_lamports;
        product.active = true;
        product.bump = ctx.bumps.product;

        emit!(ProductCreated {
            merchant: product.merchant,
            product: product.key(),
            product_id,
            price_lamports,
        });

        Ok(())
    }

    pub fn update_product_price(
        ctx: Context<UpdateProduct>,
        _product_id: String,
        price_lamports: u64,
    ) -> Result<()> {
        require!(price_lamports > 0, Stripe3Error::InvalidPrice);

        let product = &mut ctx.accounts.product;
        product.price_lamports = price_lamports;

        emit!(ProductUpdated {
            merchant: product.merchant,
            product: product.key(),
            price_lamports,
            active: product.active,
        });

        Ok(())
    }

    pub fn set_product_active(
        ctx: Context<UpdateProduct>,
        _product_id: String,
        active: bool,
    ) -> Result<()> {
        let product = &mut ctx.accounts.product;
        product.active = active;

        emit!(ProductUpdated {
            merchant: product.merchant,
            product: product.key(),
            price_lamports: product.price_lamports,
            active,
        });

        Ok(())
    }

    pub fn pay_for_resource(ctx: Context<PayForResource>, _product_id: String) -> Result<()> {
        let product = &ctx.accounts.product;
        require!(product.active, Stripe3Error::ProductInactive);
        require_keys_eq!(
            ctx.accounts.merchant.key(),
            product.merchant,
            Stripe3Error::InvalidMerchant
        );

        let ix = system_instruction::transfer(
            &ctx.accounts.buyer.key(),
            &ctx.accounts.merchant.key(),
            product.price_lamports,
        );

        invoke(
            &ix,
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.merchant.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        let receipt = &mut ctx.accounts.receipt;
        receipt.product = product.key();
        receipt.buyer = ctx.accounts.buyer.key();
        receipt.merchant = product.merchant;
        receipt.amount_lamports = product.price_lamports;
        receipt.created_at = Clock::get()?.unix_timestamp;
        receipt.bump = ctx.bumps.receipt;

        emit!(ReceiptCreated {
            product: receipt.product,
            buyer: receipt.buyer,
            merchant: receipt.merchant,
            amount_lamports: receipt.amount_lamports,
            receipt: receipt.key(),
        });

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(product_id: String)]
pub struct CreateProduct<'info> {
    #[account(mut)]
    pub merchant: Signer<'info>,
    #[account(
        init,
        payer = merchant,
        space = Product::INIT_SPACE,
        seeds = [b"product", merchant.key().as_ref(), product_id.as_bytes()],
        bump
    )]
    pub product: Account<'info, Product>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(product_id: String)]
pub struct UpdateProduct<'info> {
    #[account(mut)]
    pub merchant: Signer<'info>,
    #[account(
        mut,
        has_one = merchant @ Stripe3Error::InvalidMerchant,
        seeds = [b"product", merchant.key().as_ref(), product_id.as_bytes()],
        bump = product.bump
    )]
    pub product: Account<'info, Product>,
}

#[derive(Accounts)]
#[instruction(product_id: String)]
pub struct PayForResource<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(
        seeds = [b"product", product.merchant.as_ref(), product_id.as_bytes()],
        bump = product.bump
    )]
    pub product: Account<'info, Product>,
    /// CHECK: Checked against product.merchant before transfer.
    #[account(mut)]
    pub merchant: UncheckedAccount<'info>,
    #[account(
        init,
        payer = buyer,
        space = Receipt::INIT_SPACE,
        seeds = [b"receipt", product.key().as_ref(), buyer.key().as_ref()],
        bump
    )]
    pub receipt: Account<'info, Receipt>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Product {
    pub merchant: Pubkey,
    pub product_id: String,
    pub price_lamports: u64,
    pub active: bool,
    pub bump: u8,
}

impl Product {
    pub const MAX_ID_LEN: usize = 32;
    pub const INIT_SPACE: usize = 8 + 32 + 4 + Self::MAX_ID_LEN + 8 + 1 + 1;
}

#[account]
pub struct Receipt {
    pub product: Pubkey,
    pub buyer: Pubkey,
    pub merchant: Pubkey,
    pub amount_lamports: u64,
    pub created_at: i64,
    pub bump: u8,
}

impl Receipt {
    pub const INIT_SPACE: usize = 8 + 32 + 32 + 32 + 8 + 8 + 1;
}

#[event]
pub struct ProductCreated {
    pub merchant: Pubkey,
    pub product: Pubkey,
    pub product_id: String,
    pub price_lamports: u64,
}

#[event]
pub struct ProductUpdated {
    pub merchant: Pubkey,
    pub product: Pubkey,
    pub price_lamports: u64,
    pub active: bool,
}

#[event]
pub struct ReceiptCreated {
    pub product: Pubkey,
    pub buyer: Pubkey,
    pub merchant: Pubkey,
    pub amount_lamports: u64,
    pub receipt: Pubkey,
}

#[error_code]
pub enum Stripe3Error {
    #[msg("Product id must be 1-32 bytes.")]
    InvalidProductId,
    #[msg("Price must be greater than zero.")]
    InvalidPrice,
    #[msg("Product is not active.")]
    ProductInactive,
    #[msg("Merchant account does not match the product.")]
    InvalidMerchant,
}
