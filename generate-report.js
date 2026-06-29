const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel,
        AlignmentType, WidthType, BorderStyle, ShadingType, ExternalHyperlink, PageBreak, LevelFormat } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 22 }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "4472C4" },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 1 }
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "5B9BD5" },
        paragraph: { spacing: { before: 120, after: 80 }, outlineLevel: 2 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 960 },
        children: [new TextRun({
          text: "AI Native 前端技术栈",
          size: 48,
          bold: true,
          color: "1F4E78"
        })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 960 },
        children: [new TextRun({
          text: "最佳实践调研报告",
          size: 40,
          bold: true,
          color: "2E75B6"
        })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 480 },
        children: [new TextRun({
          text: "2026 年 6 月",
          size: 24,
          italics: true
        })]
      }),
      new PageBreak(),
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("执行摘要")]
      }),
      new Paragraph({
        spacing: { line: 360, after: 240 },
        children: [new TextRun("本报告通过深入调研当前前端技术生态，针对 AI-Native 应用开发提出最佳技术栈方案。核心发现：")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun("Next.js + React + TypeScript 是最优组合，AI 模型对其理解最深，代码生成质量最高")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun("Tailwind CSS + shadcn/ui 提供高度可维护的 UI 组件体系")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun("状态管理需要特殊考虑：AI State（模型上下文）与 UI State（用户界面）分离")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 240 },
        children: [new TextRun("Server Components 和 Server Actions 是 AI-Native 应用的架构基石")]
      }),
      new PageBreak(),
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("第一部分：前端框架对比分析")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("1.1 React")]
      }),
      new Paragraph({
        spacing: { line: 360, after: 240 },
        children: [new TextRun({ text: "AI 代码生成质量最高（Matthew Effect）", bold: true })]
      }),
      new Paragraph({
        spacing: { line: 360, after: 120 },
        children: [new TextRun("核心优势：")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 100 },
        children: [new TextRun("AI 模型训练数据最多：React 被用于约 30 百万个项目，是 Vue 的 10 倍、Svelte 的 60 倍")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 100 },
        children: [new TextRun("AI 生成质量：更少幻觉、更好的边界情况处理、更深的框架理解")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 100 },
        children: [new TextRun("AI 工具生态：v0.dev、Bolt.ai、Lovable 等专用 AI 原生工具")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 240 },
        children: [new TextRun("生产级别 UI 套件：为会话式界面优化的 shadcn/ui")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("完整技术栈推荐")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 100 },
        children: [new TextRun("框架：Next.js（AI 支持最好的全栈框架）")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 100 },
        children: [new TextRun("UI 库：Tailwind CSS + shadcn/ui（高可维护、AI 友好的组件系统）")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 100 },
        children: [new TextRun("语言：TypeScript（AI 代码生成性能提升 20%、类型安全）")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 100 },
        children: [new TextRun("数据库：Neon + Prisma ORM（无服务器、类型安全、开发友好）")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 100 },
        children: [new TextRun("认证：Clerk（现代、开箱即用、无需自建）")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 100 },
        children: [new TextRun("部署：Vercel（Next.js 官方平台、一键部署）")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 240 },
        children: [new TextRun("观测：Helicone（AI API 性能监控）")]
      }),
      new PageBreak(),
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("AI-Native 架构最佳实践")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("状态管理分层")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("AI State（模型上下文）")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 100 },
        children: [new TextRun("存放：对话历史、用户意图、模型指令 prompt")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 100 },
        children: [new TextRun("位置：服务器端（Server Action）")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 240 },
        children: [new TextRun("关键：不能泄露给浏览器，安全存放 API Keys")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("UI State（用户界面状态）")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 100 },
        children: [new TextRun("存放：模态框打开/关闭、选中项、输入框值、加载中标志")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 100 },
        children: [new TextRun("位置：客户端（React State / useTransition）")]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 240 },
        children: [new TextRun("关键：响应式、瞬间反馈")]
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("总结")]
      }),
      new Paragraph({
        spacing: { line: 360, after: 240 },
        children: [new TextRun("对于 AI-Native 前端应用，Next.js + React + TypeScript + shadcn/ui 是最优技术选择，结合 AI 代码生成工具的支持，能显著提升开发效率。同时需要重视架构设计和代码质量管理，确保可维护性和长期价值。")]
      }),
      new PageBreak(),
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("参考文献")]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new ExternalHyperlink({
          children: [new TextRun({
            text: "Exploring the Next Generation of Front-End Frameworks",
            style: "Hyperlink"
          })],
          link: "https://www.heaptrace.com/blog-posts/exploring-the-next-generation-of-front-end-frameworks-a-comparison-of-react-vue-and-svelte-in-2025"
        })]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new ExternalHyperlink({
          children: [new TextRun({
            text: "React vs Vue vs Svelte for AI-Assisted Development",
            style: "Hyperlink"
          })],
          link: "https://xbsoftware.com/blog/react-vs-vue-vs-svelte-ai-assisted-development/"
        })]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new ExternalHyperlink({
          children: [new TextRun({
            text: "Best Frameworks for AI-Assisted Development 2026",
            style: "Hyperlink"
          })],
          link: "https://encore.dev/articles/best-frameworks-ai-assisted-development"
        })]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new ExternalHyperlink({
          children: [new TextRun({
            text: "A developer's guide to designing AI-ready frontend architecture",
            style: "Hyperlink"
          })],
          link: "https://blog.logrocket.com/ai-ready-frontend-architecture-guide/"
        })]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new ExternalHyperlink({
          children: [new TextRun({
            text: "Why TypeScript Should Be a Standard for Frontend Projects",
            style: "Hyperlink"
          })],
          link: "https://www.innoraft.ai/blog/why-typescript-should-be-standard-frontend-projects"
        })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("AI-Native-Frontend-Research-Report.docx", buffer);
  console.log("✅ Report generated: AI-Native-Frontend-Research-Report.docx");
});
