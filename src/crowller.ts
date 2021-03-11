// ts直接引用js无法引用
// ts - > d.ts 翻译文件 -> js
import superagent from 'superagent';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import Analyzer from './Analyzer';

export interface Analyze {
  analyze: (html: string, filePath: string) => string;
}
class Crowller {
  private rawHTML = '';
  private filePath = path.resolve(__dirname, '../data/course.json'); //找文件

  async getRawHTML() {
    const result = await superagent.get(this.url); //获取到的内容存到result里
    return result.text;
  }

  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }
  async initSpiderProcess() {
    const html = await this.getRawHTML();
    const fileContent = this.analyzer.analyze(html, this.filePath);
    this.writeFile(fileContent);
  }
  constructor(private url: string, private analyzer: Analyze) {
    this.initSpiderProcess();
  }
}

const secret = 'x3b174jsx';
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
const analyzer = Analyzer.getInstance();
new Crowller(url, analyzer);
