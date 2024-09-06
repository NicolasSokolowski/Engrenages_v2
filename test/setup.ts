import "dotenv/config";
import { exec } from "child_process";

afterAll(async () => {
  await new Promise((resolve, reject) => {
    exec("npm run db:reset", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing db:reset: ${error}`);
        reject(error);
      } else {
        if (stderr) console.error(`stderr: ${stderr}`);
        resolve(stdout);
      }
    });
  });
});
