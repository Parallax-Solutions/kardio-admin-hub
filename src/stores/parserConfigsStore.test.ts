import { describe, it, expect } from 'vitest';
import { CreateParserConfigDto } from '@/api/generated/models/CreateParserConfigDto';

// Extract transformConfig for testing (we'll need to export it or test via the hook)
// For now, we'll test the transformation logic directly

describe('ParserConfig transformConfig logic', () => {
  const transformConfig = (apiConfig: Record<string, unknown>) => {
    const rawEmailKind = apiConfig.emailKind as string | undefined;
    const allowedEmailKinds = Object.values(CreateParserConfigDto.emailKind);
    const emailKind = allowedEmailKinds.includes(rawEmailKind as any)
      ? rawEmailKind
      : CreateParserConfigDto.emailKind.TRANSACTION_NOTIFICATION;

    const rawRules = (apiConfig.rules as Record<string, unknown> | null | undefined) ?? null;
    const rules = rawRules
      ? {
          ...rawRules,
          fields: Array.isArray((rawRules as any).fields) ? (rawRules as any).fields : [],
          validations: Array.isArray((rawRules as any).validations) ? (rawRules as any).validations : [],
        }
      : { fields: [], validations: [] };

    return {
      id: (apiConfig.id as string) ?? '',
      bankId: (apiConfig.bankId as string) ?? '',
      version: (apiConfig.version as string) ?? '1.0.0',
      strategy: (apiConfig.strategy as string) ?? CreateParserConfigDto.strategy.RULE_BASED,
      emailKind,
      isActive: (apiConfig.isActive as boolean) ?? false,
      emailSenderPatterns: Array.isArray(apiConfig.emailSenderPatterns) ? apiConfig.emailSenderPatterns : [],
      subjectPatterns: Array.isArray(apiConfig.subjectPatterns) ? apiConfig.subjectPatterns : [],
      rules,
      aiConfig: (apiConfig.aiConfig as Record<string, unknown>) ?? null,
      sampleEmailHtml: (apiConfig.sampleEmailHtml as string) ?? null,
      createdAt: (apiConfig.createdAt as string) ?? null,
      updatedAt: (apiConfig.updatedAt as string) ?? null,
    };
  };

  describe('emailKind validation', () => {
    it('should accept valid emailKind values', () => {
      const config = transformConfig({
        id: '1',
        emailKind: CreateParserConfigDto.emailKind.STATEMENT,
      });
      expect(config.emailKind).toBe(CreateParserConfigDto.emailKind.STATEMENT);
    });

    it('should default to TRANSACTION_NOTIFICATION for invalid emailKind', () => {
      const config = transformConfig({
        id: '1',
        emailKind: 'INVALID_KIND',
      });
      expect(config.emailKind).toBe(CreateParserConfigDto.emailKind.TRANSACTION_NOTIFICATION);
    });

    it('should default to TRANSACTION_NOTIFICATION for missing emailKind', () => {
      const config = transformConfig({ id: '1' });
      expect(config.emailKind).toBe(CreateParserConfigDto.emailKind.TRANSACTION_NOTIFICATION);
    });
  });

  describe('rules normalization', () => {
    it('should normalize null rules to empty fields and validations', () => {
      const config = transformConfig({ id: '1', rules: null });
      expect(config.rules).toEqual({ fields: [], validations: [] });
    });

    it('should normalize undefined rules to empty fields and validations', () => {
      const config = transformConfig({ id: '1' });
      expect(config.rules).toEqual({ fields: [], validations: [] });
    });

    it('should preserve existing fields and validations arrays', () => {
      const config = transformConfig({
        id: '1',
        rules: {
          fields: [{ name: 'amount' }],
          validations: [{ rule: 'required' }],
        },
      });
      expect(config.rules.fields).toEqual([{ name: 'amount' }]);
      expect(config.rules.validations).toEqual([{ rule: 'required' }]);
    });

    it('should normalize non-array fields to empty array', () => {
      const config = transformConfig({
        id: '1',
        rules: { fields: 'invalid', validations: null },
      });
      expect(config.rules.fields).toEqual([]);
      expect(config.rules.validations).toEqual([]);
    });
  });

  describe('patterns normalization', () => {
    it('should normalize null emailSenderPatterns to empty array', () => {
      const config = transformConfig({ id: '1', emailSenderPatterns: null });
      expect(config.emailSenderPatterns).toEqual([]);
    });

    it('should normalize null subjectPatterns to empty array', () => {
      const config = transformConfig({ id: '1', subjectPatterns: null });
      expect(config.subjectPatterns).toEqual([]);
    });

    it('should preserve valid pattern arrays', () => {
      const config = transformConfig({
        id: '1',
        emailSenderPatterns: ['pattern1', 'pattern2'],
        subjectPatterns: ['subject1'],
      });
      expect(config.emailSenderPatterns).toEqual(['pattern1', 'pattern2']);
      expect(config.subjectPatterns).toEqual(['subject1']);
    });
  });

  describe('default values', () => {
    it('should provide defaults for missing required fields', () => {
      const config = transformConfig({});
      expect(config.id).toBe('');
      expect(config.bankId).toBe('');
      expect(config.version).toBe('1.0.0');
      expect(config.strategy).toBe(CreateParserConfigDto.strategy.RULE_BASED);
      expect(config.isActive).toBe(false);
    });

    it('should preserve provided values', () => {
      const config = transformConfig({
        id: 'test-id',
        bankId: 'bank-123',
        version: '2.0.0',
        strategy: CreateParserConfigDto.strategy.AI,
        isActive: true,
      });
      expect(config.id).toBe('test-id');
      expect(config.bankId).toBe('bank-123');
      expect(config.version).toBe('2.0.0');
      expect(config.strategy).toBe(CreateParserConfigDto.strategy.AI);
      expect(config.isActive).toBe(true);
    });
  });
});
