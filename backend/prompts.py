# -*- coding: utf-8 -*-
"""
Prompt templates for novel generation
"""

OUTLINE_GENERATION_PROMPT = """你是一个专业的小说策划。根据以下信息策划一本小说：

类型: {genre}
故事背景: {outline}
角色设定: {characters}

请生成:
1. 小说标题（一句话）
2. 章节列表（{chapter_count}章，每章有标题和一句话概述）

严格按照以下JSON格式输出，不要包含任何其他内容：
{{
    "title": "小说标题",
    "chapters": [
        {{"number": 1, "title": "第一章标题", "summary": "本章概述"}},
        ...
    ]
}}"""

CHAPTER_GENERATION_PROMPT = """你是网络小说作家，擅长创作引人入胜的故事。

小说信息:
- 标题: {novel_title}
- 类型: {genre}

已生成的章节:
{generated_chapters}

当前章节: 第{number}章 "{title}"
本章概述: {summary}

请根据前文背景，创作第{number}章的完整内容。章节应该:
- 与前文情节紧密衔接
- 包含适当的冲突和悬念
- 人物对话自然
- 情节发展合理

直接输出小说内容，不需要任何前缀说明。"""

CHAPTER_REGENERATION_PROMPT = """你是网络小说作家，擅长创作引人入胜的故事。

小说信息:
- 标题: {novel_title}
- 类型: {genre}

已生成的章节:
{generated_chapters}

当前章节: 第{number}章 "{title}"
原始概述: {original_summary}

用户要求的新方向: {new_direction}

请根据新的方向要求，重新创作第{number}章的完整内容。确保:
- 采纳新的方向设定
- 与前文情节保持一致
- 情节发展引人入胜

直接输出小说内容，不需要任何前缀说明。"""
