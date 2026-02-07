# Deployment Configuration

## Production Domain

The production deployment domain is set to: **awake01**

This domain satisfies the platform naming requirements:
- Length: 7 characters (within 5-50 character limit)
- Characters: Only lowercase letters (valid)
- No special characters except hyphens (compliant)

## Platform Naming Rules

All production domains must follow these rules:
- **Minimum length**: 5 characters
- **Maximum length**: 50 characters
- **Allowed characters**: Letters (a-z, A-Z), numbers (0-9), and hyphens (-)
- **No spaces or special characters** (except hyphens)

## Redeployment Instructions

To redeploy the application to production with this domain:

1. Ensure the domain configuration in `domain.json` is set to "awake01"
2. Trigger the production deployment process
3. The application will be deployed and accessible at the production URL for domain "awake01"

**Note**: No application code or UI changes are included in this deployment. This is purely a domain configuration update to enable successful production deployment.
