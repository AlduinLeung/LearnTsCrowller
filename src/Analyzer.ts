import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { Analyze } from './crowller';
interface Course {
  title: string;
  count: number;
}

interface CourseResult {
  time: number;
  data: Course[];
}

interface Content {
  [propName: number]: Course[];
}

export default class Analyzer implements Analyze {
  private static instance: Analyzer;
  static getInstance() {
    if (!Analyzer.instance) {
      Analyzer.instance = new Analyzer();
    }
    return Analyzer.instance;
  }
  private getCourseInfo(html: string) {
    const $ = cheerio.load(html); //api
    const courseItems = $('.course-item'); //拿到courseItem
    const courseInfos: Course[] = []; //构建一个interface的对象数组
    courseItems.map((indx, ele) => {
      const descs = $(ele).find('.course-desc');
      const title = descs.eq(0).text();
      const count = parseInt(descs.eq(1).text().split('：')[1]);
      courseInfos.push({ title, count });
    });
    const result = {
      time: new Date().getTime(),
      data: courseInfos,
    };
    return result;
  }
  private generateJSONContent(courseInfo: CourseResult, filePath: string) {
    let fileContent: Content = {}; //设置一个Content的内容
    if (fs.existsSync(filePath)) {
      // 读一个fileContent
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    //继续把这次读取的内容存到fileContent里
    fileContent[courseInfo.time] = courseInfo.data;
    return fileContent;
  }
  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJSONContent(courseInfo, filePath);
    return JSON.stringify(fileContent);
  }
  private constructor() {}
}
