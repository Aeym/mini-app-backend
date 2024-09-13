import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async informStructureDeletion(userEmail: string): Promise<void> {
    const secondsToWait = Math.trunc(Math.random() * 7) + 1;

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(`${userEmail} informed!`);
        resolve();
      }, secondsToWait * 1000);
    });
  }

  async sendEmailsInBatches(emails: string[]): Promise<void> {
    const batchSize = 3;
    for (let i = 0; i < emails.length; i += batchSize) {
      const emailBatch = emails.slice(i, i + batchSize);
      await Promise.all(
        emailBatch.map((email) => this.informStructureDeletion(email)),
      );
    }
  }
}
