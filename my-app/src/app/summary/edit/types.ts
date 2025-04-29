export type TimesheetData = {
    id: number;
    siteName: string;
    numberOfPeople: number;
    dailyWorkingEmployees: number;
    workingPeople: number;
    businessLeave: number;
    sickLeave: number;
    peopleLeave: number;
    overContractEmployee: number;
    replacementEmployee: number;
    replacementNames: string[];
    remark: string;
    date: Date;
  };
  