import { readFileSync } from "fs";

export default function handler(req: any, res: any) {

    const course = req.query.course;
    
    const fileName = `./data/${course}.json`;

    const jsonCourse = readFileSync(fileName, 'utf-8');

  
    res.status(200).json(jsonCourse);
  }