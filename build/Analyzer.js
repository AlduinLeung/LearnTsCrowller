"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var fs_1 = __importDefault(require("fs"));
var Analyzer = /** @class */ (function () {
    function Analyzer() {
    }
    Analyzer.getInstance = function () {
        if (!Analyzer.instance) {
            Analyzer.instance = new Analyzer();
        }
        return Analyzer.instance;
    };
    Analyzer.prototype.getCourseInfo = function (html) {
        var $ = cheerio_1.default.load(html); //api
        var courseItems = $('.course-item'); //拿到courseItem
        var courseInfos = []; //构建一个interface的对象数组
        courseItems.map(function (indx, ele) {
            var descs = $(ele).find('.course-desc');
            var title = descs.eq(0).text();
            var count = parseInt(descs.eq(1).text().split('：')[1]);
            courseInfos.push({ title: title, count: count });
        });
        var result = {
            time: new Date().getTime(),
            data: courseInfos,
        };
        return result;
    };
    Analyzer.prototype.generateJSONContent = function (courseInfo, filePath) {
        var fileContent = {}; //设置一个Content的内容
        if (fs_1.default.existsSync(filePath)) {
            // 读一个fileContent
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        //继续把这次读取的内容存到fileContent里
        fileContent[courseInfo.time] = courseInfo.data;
        return fileContent;
    };
    Analyzer.prototype.analyze = function (html, filePath) {
        var courseInfo = this.getCourseInfo(html);
        var fileContent = this.generateJSONContent(courseInfo, filePath);
        return JSON.stringify(fileContent);
    };
    return Analyzer;
}());
exports.default = Analyzer;
