# Soul Shards Pricing & Margin Analysis

## Base Rate

**100 Soul Shards = 1.00 EUR**

## Fee Breakdown

### Stripe Fees
- **2.9%** of the transaction amount
- **+ 0.30 EUR** flat fee per transaction

### URSSAF (French Social Contributions)
- **~29%** of gross revenue (micro-entrepreneur regime)

## Net Margin Per Transaction

| Package        | Price (EUR) | Stripe Fee      | After Stripe | URSSAF (29%) | Net Revenue | Margin |
|----------------|------------|-----------------|-------------|-------------|------------|--------|
| 500 Shards     | 5.00       | 0.45 (0.15+0.30)| 4.55        | 1.32        | 3.23       | 64.6%  |
| 1,000 Shards   | 10.00      | 0.59 (0.29+0.30)| 9.41        | 2.73        | 6.68       | 66.8%  |
| 2,500 Shards   | 25.00      | 1.03 (0.73+0.30)| 23.98       | 6.95        | 17.02      | 68.1%  |
| 5,000 Shards   | 50.00      | 1.75 (1.45+0.30)| 48.25       | 13.99       | 34.26      | 68.5%  |
| 10,000 Shards  | 100.00     | 3.20 (2.90+0.30)| 96.80       | 28.07       | 68.73      | 68.7%  |

## Key Takeaways

1. **Small transactions are expensive.** The 0.30 EUR flat fee hits hard on low amounts.
   - At 5.00 EUR: Stripe takes 9.0% effective rate (vs 3.2% at 100 EUR).
   - Minimum viable package should be ~5 EUR to keep Stripe overhead manageable.

2. **Effective total fee rate is ~32-38%** depending on transaction size:
   - 5 EUR purchase: ~35.4% total fees (Stripe + URSSAF)
   - 100 EUR purchase: ~31.3% total fees

3. **Net margin stabilizes around 65-69%** for packages >= 5 EUR.

4. **Recommendation**: Offer packages starting at 500 Shards (5 EUR) minimum. Consider volume discounts for larger packages to incentivize bigger purchases (e.g., 5,200 Shards for 50 EUR = 4% bonus).

## URSSAF Note

The 29% rate applies to the **gross revenue** (before Stripe fees) under the micro-entrepreneur BIC (vente de marchandises) regime. If classified as BNC (services), the rate is ~22%. Verify the applicable category with your accountant. The table above uses 29% applied to the post-Stripe amount as a conservative estimate — in practice URSSAF is calculated on total invoiced revenue (pre-Stripe), which slightly reduces net margins.
