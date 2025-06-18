export const departments = [
  "CSE", // Computer Science and Engineering
  "IT", // Information Technology
  "ECE", // Electronics and Communication Engineering
  "EEE", // Electrical and Electronics Engineering
  "ME", // Mechanical Engineering
  "CE", // Civil Engineering
  "BT", // Biotechnology
  "CHE", // Chemical Engineering
  "AERO", // Aeronautical Engineering
  "AEIE", // Applied Electronics & Instrumentation
  "MCA", // Master of Computer Applications
  "BBA", // Bachelor of Business Administration
  "MBA", // Master of Business Administration
  "BSc", // Bachelor of Science
  "BA", // Bachelor of Arts
  "BCom", // Bachelor of Commerce
  "LAW", // Law
  "MED", // Medical/Nursing/Paramedical
  "ARCH", // Architecture
];

export const role = ["student", "faculty", "admin"];

export const status = ["active", "rejected", "closed"];

export const admin = "admin";
export const password = "password";
export const salt = "$2b$10$OO3RmCCcQHYcAoqtvuBXje";
export function generateTokenOptions(type = "access") {
  return {
    expiresIn: type.toLowerCase() === "access" ? "1d" : "15d",
    issuer: "Nishan and Nishant",
    audience: "college-portal",
    subject: "token options",
  };
}

export const tokenSecret = {
  access:
    "826pG!9e#d476cdcRkfc1246@Nae34511ef0bT1$VqZ^3xL0b8528m30ca60687d56E*wY8uIjQ4+25d65ce9sFdCbcd62492%Ha#rMgXz$KoWnL7vA=tY5bPl",
  refresh:
    "lPb5Yt=Av7LnWoK$zXgMr#aH%29426dcbCdFs9ec56d52+4QjIu8Yw*E65d78606ac03m8258b0Lx3^ZqV$1Tb0fe11543eaN@6421cfkRcdc674d#e9!Gp628",
};

export default "Constants";
