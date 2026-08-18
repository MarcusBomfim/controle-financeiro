import { PasswordService } from './password.service';

describe('PasswordService', () => {
  const service = new PasswordService();

  it('creates a hash and validates the correct password', async () => {
    const password = 'senha-segura-123';
    const passwordHash = await service.hash(password);

    expect(passwordHash).not.toBe(password);
    expect(passwordHash).toMatch(/^scrypt\$/);
    await expect(service.verify(password, passwordHash)).resolves.toBe(true);
  });

  it('rejects an incorrect password and a malformed hash', async () => {
    const passwordHash = await service.hash('senha-correta-123');

    await expect(
      service.verify('senha-incorreta-123', passwordHash),
    ).resolves.toBe(false);
    await expect(service.verify('senha', 'hash-invalido')).resolves.toBe(false);
  });
});
