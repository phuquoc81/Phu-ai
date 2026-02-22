'use strict';

const { getHelmetOptions, PERMISSIONS_POLICY, CSP_DIRECTIVES, HSTS_OPTIONS } = require('../src/security/policies');

describe('Security policies', () => {
  describe('getHelmetOptions()', () => {
    let opts;
    beforeAll(() => { opts = getHelmetOptions(); });

    test('enables contentSecurityPolicy', () => {
      expect(opts.contentSecurityPolicy).toBeDefined();
      expect(opts.contentSecurityPolicy.directives).toBe(CSP_DIRECTIVES);
    });

    test('enables HSTS with preload and includeSubDomains', () => {
      expect(opts.hsts).toMatchObject({
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      });
    });

    test('sets frameguard to deny', () => {
      expect(opts.frameguard).toEqual({ action: 'deny' });
    });

    test('enables noSniff', () => {
      expect(opts.noSniff).toBe(true);
    });

    test('sets referrer policy', () => {
      expect(opts.referrerPolicy).toEqual({ policy: 'strict-origin-when-cross-origin' });
    });
  });

  describe('CSP directives', () => {
    test("defaultSrc is restricted to 'self'", () => {
      expect(CSP_DIRECTIVES.defaultSrc).toEqual(["'self'"]);
    });

    test('scriptSrc includes Stripe JS', () => {
      expect(CSP_DIRECTIVES.scriptSrc).toContain('https://js.stripe.com');
    });

    test("objectSrc is 'none'", () => {
      expect(CSP_DIRECTIVES.objectSrc).toEqual(["'none'"]);
    });

    test("frameAncestors is 'none' (clickjacking protection)", () => {
      expect(CSP_DIRECTIVES.frameAncestors).toEqual(["'none'"]);
    });
  });

  describe('HSTS options', () => {
    test('maxAge is at least one year', () => {
      expect(HSTS_OPTIONS.maxAge).toBeGreaterThanOrEqual(31536000);
    });
  });

  describe('Permissions-Policy', () => {
    test('disables camera', () => {
      expect(PERMISSIONS_POLICY).toContain('camera=()');
    });

    test('allows payment for Stripe', () => {
      expect(PERMISSIONS_POLICY).toContain('payment=');
      expect(PERMISSIONS_POLICY).toContain('https://js.stripe.com');
    });
  });
});
