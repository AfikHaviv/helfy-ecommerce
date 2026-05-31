# Helfy eCommerce Platform

## Project Overview
Brief one-paragraph description of what was built and the tech stack.

---

## AI Tooling
- **AI Coding Assistant**: Cline (VS Code extension)
- **Model**: Claude Sonnet 4.5
- **Blueprint File**: `initial.md`

---

## Manual Interventions

| Issue | Why AI Failed | What I Did |
|---|---|---|
| Guest cart session strategy not defined | initial.md didn't specify session handling | Decided to use cookie-based session ID generated on first cart action | 
| MySQL not in system PATH | Cline couldn't execute terminal commands | Added MySQL bin folder to system PATH manually |
| Phase 3 time constraintPhase 3 time constraint | AI cannot prioritize business value over completeness | Manually reduced scope to 6 core pages covering the required user journey |
| The AI kept explaining and justifying its code choices instead of just generating code | When in time constaints, the AI should focus on code generation and skip explanations | I had to prompt the AI multiple times to stop explaining and just generate code, which slowed down progress significantly |
| The AI generated code had some flaws | Inconsistent assumptions throughout the coding process | I had to help the AI understand the flaws and guide it to fix them, which took additional time and effort |

---

## AI-Gap Analysis
Things where human intervention was more efficient than prompt tuning:

The AI preformed well in generating code based on clear instructions, but struggled with areas that required strategic decision-making or prioritization of features. For example, the session management strategy for guest carts was not defined in the blueprint, which is a critical architectural, I additon scope prioritization under time constraints is another area where the AI cannot make decisions based on business value, so I had to manually reduce the scope of Phase 3 to focus on core features.
---

## How to Run

### Prerequisites
- Node.js 18+
- MySQL 8.0+

### Setup
```bash
git clone https://github.com/AfikHaviv/helfy-ecommerce.git
cd helfy-ecommerce
docker compose up --build

```

### Test Credentials
- **Admin**: admin@helfy.com / Password123!