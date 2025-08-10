declare module "moment" {
  interface Moment {
    jYear(): number;
    jMonth(): number;
    jDate(): number;
    jDaysInMonth(): number;
  }

  interface MomentStatic {
    jMoment(input: string, format: string): Moment;
    loadPersian(options?: { dialect?: string }): void;
  }
}
