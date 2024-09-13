import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

jest.useFakeTimers();

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('informStructureDeletion', () => {
    it('should log and resolve after a random delay', async () => {
      const logSpy = jest.spyOn(console, 'log');
      const email = 'test@example.com';

      const promise = service.informStructureDeletion(email);

      jest.runAllTimers();

      await promise;

      expect(logSpy).toHaveBeenCalledWith(`${email} informed!`);
      logSpy.mockRestore();
    });
  });

  describe('sendEmailsInBatches', () => {
    it('should send emails in batches of 3', async () => {
      const emails = [
        'email1@example.com',
        'email2@example.com',
        'email3@example.com',
        'email4@example.com',
        'email5@example.com',
      ];

      const informSpy = jest
        .spyOn(service, 'informStructureDeletion')
        .mockResolvedValue();

      const promise = service.sendEmailsInBatches(emails);

      jest.runAllTimers();

      await promise;

      expect(informSpy).toHaveBeenCalledTimes(5);

      expect(informSpy).toHaveBeenNthCalledWith(1, 'email1@example.com');
      expect(informSpy).toHaveBeenNthCalledWith(2, 'email2@example.com');
      expect(informSpy).toHaveBeenNthCalledWith(3, 'email3@example.com');
      expect(informSpy).toHaveBeenNthCalledWith(4, 'email4@example.com');
      expect(informSpy).toHaveBeenNthCalledWith(5, 'email5@example.com');

      informSpy.mockRestore();
    });

    it('should handle an empty email list gracefully', async () => {
      const informSpy = jest
        .spyOn(service, 'informStructureDeletion')
        .mockResolvedValue();

      await service.sendEmailsInBatches([]);

      expect(informSpy).not.toHaveBeenCalled();
    });
  });
});
