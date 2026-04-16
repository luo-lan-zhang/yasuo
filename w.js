// script.js - AI Music Studio

class AIMusicStudio {
  constructor() {
    this.apiToken = localStorage.getItem('huggingface_token') || '';
    this.currentResult = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateApiStatus();
    this.loadSettings();
  }

  bindEvents() {
    // 导航切换
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const section = e.currentTarget.dataset.section;
        this.switchSection(section);
      });
    });

    // 生成按钮
    document.getElementById('generateBtn').addEventListener('click', () => {
      this.generateMusic();
    });

    // 重新生成歌词
    document.getElementById('regenerateLyrics').addEventListener('click', () => {
      this.generateMusic();
    });

    // 复制歌词
    document.getElementById('copyLyrics').addEventListener('click', () => {
      this.copyLyrics();
    });

    // 保存设置
    document.getElementById('saveSettings').addEventListener('click', () => {
      this.saveSettings();
    });
  }

  switchSection(sectionName) {
    // 更新导航
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.section === sectionName) {
        item.classList.add('active');
      }
    });

    // 更新内容区
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(`${sectionName}Section`).classList.add('active');
  }

  updateApiStatus() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('apiStatusText');
    
    if (this.apiToken) {
      statusDot.classList.add('active');
      statusText.textContent = 'API 已配置';
    } else {
      statusDot.classList.remove('active');
      statusText.textContent = 'API 未配置';
    }
  }

  loadSettings() {
    if (this.apiToken) {
      document.getElementById('apiToken').value = this.apiToken;
    }
  }

  saveSettings() {
    const token = document.getElementById('apiToken').value.trim();
    this.apiToken = token;
    localStorage.setItem('huggingface_token', token);
    this.updateApiStatus();
    
    alert('✅ 设置已保存！');
  }

  async generateMusic() {
    const theme = document.getElementById('theme').value.trim();
    const emotion = document.getElementById('emotion').value;
    const style = document.getElementById('style').value;
    const tempo = document.getElementById('tempo').value;
    const language = document.getElementById('language').value;
    const keywords = document.getElementById('keywords').value.trim();

    if (!theme) {
      alert('⚠️ 请输入歌曲主题！');
      return;
    }

    // 显示加载状态
    this.showLoading();

    try {
      let lyrics = '';
      
      // 如果配置了 API，使用 AI 生成
      if (this.apiToken) {
        lyrics = await this.generateLyricsWithAI(theme, emotion, style, language, keywords);
      } else {
        // 否则使用本地模板
        lyrics = this.generateLyricsLocally(theme, emotion, style, keywords);
      }

      // 生成编曲建议
      const arrangement = this.generateArrangement(emotion, style, tempo);

      // 保存结果
      this.currentResult = { lyrics, arrangement, theme, emotion, style };

      // 显示结果
      this.displayResults(lyrics, arrangement);
      
      // 保存到历史
      this.saveToHistory({ lyrics, arrangement, theme, emotion, style, date: new Date() });

    } catch (error) {
      console.error('生成失败:', error);
      alert('❌ 生成失败，请检查网络连接或 API 配置');
      this.showEmpty();
    }
  }

  async generateLyricsWithAI(theme, emotion, style, language, keywords) {
    const prompt = this.buildAIPrompt(theme, emotion, style, language, keywords);
    
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 300,
            temperature: 0.8,
            top_p: 0.9,
            do_sample: true
          }
        })
      });

      if (!response.ok) {
        throw new Error('API 请求失败');
      }

      const data = await response.json();
      
      if (data && data[0] && data[0].generated_text) {
        return this.formatLyrics(data[0].generated_text);
      }
      
      throw new Error('无效的 API 响应');
      
    } catch (error) {
      console.warn('AI API 调用失败，切换到本地生成:', error);
      return this.generateLyricsLocally(theme, emotion, style, keywords);
    }
  }

  buildAIPrompt(theme, emotion, style, language, keywords) {
    const emotionMap = {
      happy: '欢快喜悦',
      sad: '忧伤抒情',
      romantic: '浪漫温馨',
      energetic: '激情活力',
      melancholy: '忧郁沉思',
      hopeful: '充满希望'
    };

    const styleMap = {
      pop: '流行',
      rock: '摇滚',
      ballad: '抒情',
      rnb: 'R&B',
      folk: '民谣',
      electronic: '电子',
      hiphop: '嘻哈'
    };

    let prompt = `创作一首${styleMap[style]}风格的歌曲歌词，主题是"${theme}"，情感基调是${emotionMap[emotion]}。`;
    
    if (keywords) {
      prompt += ` 请在歌词中包含以下元素：${keywords}。`;
    }
    
    prompt += '\n\n歌词要求：\n';
    prompt += '- 包含主歌（Verse）和副歌（Chorus）\n';
    prompt += '- 要有韵律和节奏感\n';
    prompt += '- 情感真挚动人\n';
    prompt += '- 适合演唱\n\n';
    prompt += '歌词：';

    return prompt;
  }

  formatLyrics(text) {
    // 清理和格式化歌词
    let formatted = text.replace(/\n{3,}/g, '\n\n');
    
    // 如果没有明显的段落分隔，尝试智能分段
    if (!formatted.includes('\n\n')) {
      const lines = formatted.split('\n');
      const chunks = [];
      for (let i = 0; i < lines.length; i += 4) {
        chunks.push(lines.slice(i, i + 4).join('\n'));
      }
      formatted = chunks.join('\n\n');
    }
    
    return formatted.trim();
  }

  generateLyricsLocally(theme, emotion, style, keywords) {
    const templates = this.getLyricsTemplates();
    const key = `${emotion}_${style}`;
    
    let templateList = templates[key];
    if (!templateList) {
      //  fallback 到同情感的其他风格
      const fallbackKey = Object.keys(templates).find(k => k.startsWith(emotion));
      templateList = templates[fallbackKey] || templates['happy_pop'];
    }

    const template = templateList[Math.floor(Math.random() * templateList.length)];
    let lyrics = template.replace(/{theme}/g, theme);
    
    if (keywords) {
      const keywordList = keywords.split(/[,，]/).map(k => k.trim()).filter(k => k);
      if (keywordList.length > 0) {
        const randomKeyword = keywordList[Math.floor(Math.random() * keywordList.length)];
        lyrics = lyrics.replace(/{keyword}/g, randomKeyword);
      }
    }
    
    lyrics = lyrics.replace(/{keyword}/g, theme);
    
    return lyrics;
  }

  getLyricsTemplates() {
    return {
      'happy_pop': [
        "【主歌】\n阳光洒在窗台 {theme}的味道\n微风轻轻吹过嘴角上扬\n每一天都充满期待\n和你一起就是最美好的时光\n\n【副歌】\n{theme}像彩虹般绚烂\n照亮了我整个世界\n手牵手走过每个角落\n笑声在空中回荡不停歇\n\n【桥段】\n啦啦啦 {theme}多美妙\n啦啦啦 心情在舞蹈\n啦啦啦 幸福来敲门\n啦啦啦 快乐围绕",
        
        "【主歌】\n{theme}的季节已经来到\n空气中弥漫着甜蜜味道\n脚步轻快像小鸟飞翔\n心中的花朵正在绽放\n\n【副歌】\n不需要太多言语表达\n一个眼神就能明白彼此\n{theme}让我们更加靠近\n这份感觉永远不会消失\n\n【结尾】\n让我们一起唱这首歌\n把快乐传递给每个人\n{theme}的力量如此强大\n让全世界都感受到温暖"
      ],
      
      'sad_ballad': [
        "【主歌】\n雨滴敲打着窗户\n{theme}的痛楚难以释怀\n手机里你的照片\n成了我最珍贵的负担\n\n【副歌】\n为什么结局是这样\n明明说过不会离开\n{theme}变成了遗憾\n只能在回忆里徘徊\n\n【桥段】\n如果时间能够倒流\n我会做出不同选择\n可惜现实没有如果\n只能学会放手接受",
        
        "【主歌】\n秋风扫过落叶纷飞\n{theme}的碎片散落一地\n小提琴哀怨地哭泣\n像是在为我叹息\n\n【副歌】\n你说要走我无法挽留\n就像抓不住的沙粒\n{theme}终究要结束\n留下我一个人面对\n\n【结尾】\n眼泪无声地滑落\n打湿了枕边的信纸\n那些甜蜜的承诺\n如今变成了讽刺"
      ],
      
      'romantic_pop': [
        "【主歌】\n星光点缀着夜空\n{theme}的气息弥漫四周\n你的眼睛如此迷人\n让我沉醉无法自拔\n\n【副歌】\n轻轻牵起你的手\n感受心跳加速的节奏\n{theme}如此甜蜜\n像是吃了蜜糖一般\n\n【桥段】\n这一刻时间静止\n世界只剩下我和你\n{theme}的魔力无穷\n让我们紧紧相依"
      ],
      
      'energetic_rock': [
        "【主歌】\n能量爆发就在此刻\n{theme}的火焰熊熊燃烧\n电吉他嘶吼咆哮\n鼓点密集如雨点般落下\n\n【副歌】\n跳起来甩起来\n把所有的压力都抛开\n{theme}让我们疯狂\n这一刻没有规则约束\n\n【桥段】\n音量调到最大\n让全世界都听到\n{theme}的呐喊声\n震撼每一个人的心"
      ],
      
      'melancholy_folk': [
        "【主歌】\n老旧的木吉他\n弹奏着{theme}的忧伤\n窗外的梧桐树\n叶子一片片凋落\n\n【副歌】\n远方的你是否安好\n是否也会想起我\n{theme}像一杯苦茶\n越品越是回甘\n\n【结尾】\n岁月匆匆流逝\n带走了青春年华\n{theme}沉淀成诗\n写在泛黄的日记里"
      ],
      
      'hopeful_pop': [
        "【主歌】\n黎明前的黑暗\n{theme}的光芒即将绽放\n新的旅程已开始\n充满无限的可能\n\n【副歌】\n跌倒了再站起来\n失败是成功的垫脚石\n{theme}在心中燃烧\n指引我们前进方向\n\n【桥段】\n相信自己的力量\n没有什么不能实现\n{theme}的翅膀展开\n飞向更高的天空"
      ]
    };
  }

  generateArrangement(emotion, style, tempo) {
    return {
      chords: this.getChordProgression(emotion, style),
      rhythm: this.getRhythmPattern(tempo),
      instruments: this.getInstruments(style),
      structure: this.getStructure(),
      tips: this.getProductionTips(emotion)
    };
  }

  getChordProgression(emotion, style) {
    const progressions = {
      happy: {
        pop: "C - G - Am - F | C - G - F - G | C - Em - F - G",
        rock: "E - B - C#m - A | E - B - A - B | E - G#m - A - B",
        ballad: "F - C - Dm - Bb | F - C - Bb - C | F - Am - Bb - C"
      },
      sad: {
        pop: "Am - F - C - G | Am - F - G - F | Am - Dm - F - G",
        ballad: "Dm - Bb - F - C | Dm - Bb - C - Bb | Dm - Gm - Bb - C"
      },
      romantic: {
        pop: "C - Em - Am - G | C - Em - F - G | C - Am - F - G",
        ballad: "Eb - Gm - Cm - Bb | Eb - Gm - Ab - Bb | Eb - Cm - Ab - Bb"
      },
      energetic: {
        rock: "A - E - F#m - D | A - E - D - E | A - C#m - D - E",
        electronic: "Am - F - C - G | Am - F - G - F | Am - Dm - F - G"
      },
      melancholy: {
        folk: "Em - C - G - D | Em - C - D - C | Em - Am - C - D",
        ballad: "Bm - G - D - A | Bm - G - A - G | Bm - Em - G - A"
      },
      hopeful: {
        pop: "G - D - Em - C | G - D - C - D | G - Bm - C - D",
        folk: "C - G - Am - F | C - G - F - G | C - Em - F - G"
      }
    };

    return progressions[emotion]?.[style] || progressions.happy.pop;
  }

  getRhythmPattern(tempo) {
    const patterns = {
      slow: {
        desc: "慢板节奏 (60-80 BPM)",
        pattern: "底鼓: X . . . | X . . . | X . . .\n军鼓: . . X . | . . X . | . . X .\n踩镲: X X X X | X X X X | X X X X",
        feel: "舒缓、深情，适合抒情歌曲"
      },
      medium: {
        desc: "中板节奏 (80-120 BPM)",
        pattern: "底鼓: X . X . | X . . X | X . X .\n军鼓: . . X . | . . X . | . . X .\n踩镲: X X X X | X X X X | X X X X",
        feel: "平衡、流畅，适合大多数流行歌曲"
      },
      fast: {
        desc: "快板节奏 (120-160 BPM)",
        pattern: "底鼓: X . X . | X X X . | X . X .\n军鼓: . X . X | . X . X | . X . X\n踩镲: X X X X | X X X X | X X X X",
        feel: "活力、激情，适合摇滚和舞曲"
      }
    };

    return patterns[tempo] || patterns.medium;
  }

  getInstruments(style) {
    const instruments = {
      pop: ["主唱", "钢琴/键盘", "原声吉他", "贝斯", "鼓组", "弦乐组"],
      rock: ["主唱", "电吉他(主音)", "电吉他(节奏)", "贝斯", "鼓组", "键盘"],
      ballad: ["主唱", "钢琴", "大提琴", "小提琴", "原声吉他", "轻柔鼓组"],
      rnb: ["主唱", "键盘/合成器", "电吉他", "贝斯", "鼓机", "和声"],
      folk: ["主唱", "原声吉他", "口琴/手风琴", "贝斯", "打击乐"],
      electronic: ["主唱", "合成器lead", "合成器bass", "鼓机", "采样/音效"],
      hiphop: ["主唱/Rapper", "鼓机", "贝斯", "采样", "键盘", "DJ"]
    };

    return instruments[style] || instruments.pop;
  }

  getStructure() {
    return ["前奏 Intro", "主歌 Verse 1", "预副歌 Pre-Chorus", "副歌 Chorus", 
            "主歌 Verse 2", "预副歌 Pre-Chorus", "副歌 Chorus", 
            "桥段 Bridge", "副歌 Chorus", "尾奏 Outro"];
  }

  getProductionTips(emotion) {
    const tips = {
      happy: [
        "使用明亮的音色，避免过于沉闷的低频",
        "保持动态范围，让副歌更有冲击力",
        "可以加入手拍、响指等元素增加活力",
        "混音时让人声突出，保持清晰度",
        "适当使用合唱效果增加空间感"
      ],
      sad: [
        "使用混响营造空灵感，但不要过度",
        "低频要控制好，避免浑浊",
        "可以使用延迟效果增加情感深度",
        "人声处理要细腻，保留呼吸声",
        "考虑使用钢琴或弦乐作为主要伴奏"
      ],
      romantic: [
        "温暖的音色是关键，避免尖锐的高频",
        "可以使用立体声扩展增加宽度",
        "适度的压缩让人声更亲密",
        "加入环境音效增强氛围",
        "和声编排要丰富但不喧宾夺主"
      ],
      energetic: [
        "强烈的低频和清晰的打击乐是重点",
        "使用侧链压缩创造泵动感",
        "buildup 和 drop 的对比要明显",
        "自动化控制滤波器增加变化",
        "保持整体响度，但要避免失真"
      ],
      melancholy: [
        "留白很重要，不要填得太满",
        "使用原声乐器增加真实感",
        "轻微的磁带饱和可以增加怀旧感",
        "人声可以稍微靠后，营造距离感",
        "考虑使用单声道元素增加聚焦"
      ],
      hopeful: [
        "逐渐增加的编曲层次象征希望的增长",
        "使用上升的音阶和和声进行",
        "明亮的高频给人向上的感觉",
        "可以在结尾加入合唱团效果",
        "动态要从弱到强，体现突破感"
      ]
    };

    return tips[emotion] || tips.happy;
  }

  showLoading() {
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('resultContent').style.display = 'none';
    document.getElementById('loadingState').style.display = 'block';
  }

  showEmpty() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('resultContent').style.display = 'none';
    document.getElementById('emptyState').style.display = 'block';
  }

  displayResults(lyrics, arrangement) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
    
    // 显示歌词
    document.getElementById('lyricsBody').textContent = lyrics;
    
    // 显示和弦
    document.getElementById('chordDisplay').textContent = arrangement.chords;
    
    // 显示节奏
    const rhythmHtml = `
      <div><strong>${arrangement.rhythm.desc}</strong></div>
      <pre style="margin-top: 10px;">${arrangement.rhythm.pattern}</pre>
      <div style="margin-top: 10px; font-style: italic; font-size: 13px;">感觉：${arrangement.rhythm.feel}</div>
    `;
    document.getElementById('rhythmDisplay').innerHTML = rhythmHtml;
    
    // 显示乐器
    const instrHtml = arrangement.instruments.map(inst => 
      `<span class="instr-tag">${inst}</span>`
    ).join('');
    document.getElementById('instrumentTags').innerHTML = instrHtml;
    
    // 显示结构
    const structHtml = arrangement.structure.map((part, index) => `
      ${index > 0 ? '<span class="struct-arrow">→</span>' : ''}
      <span class="struct-part">${part}</span>
    `).join('');
    document.getElementById('structureTimeline').innerHTML = structHtml;
    
    // 显示制作建议
    const tipsHtml = arrangement.tips.map(tip => `<li>${tip}</li>`).join('');
    document.getElementById('tipsList').innerHTML = tipsHtml;
    
    // 显示结果区域
    document.getElementById('resultContent').style.display = 'flex';
  }

  copyLyrics() {
    if (!this.currentResult) return;
    
    const lyrics = this.currentResult.lyrics;
    navigator.clipboard.writeText(lyrics).then(() => {
      const btn = document.getElementById('copyLyrics');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '✓';
      btn.style.background = '#48bb78';
      btn.style.borderColor = '#48bb78';
      
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.style.borderColor = '';
      }, 2000);
    }).catch(err => {
      console.error('复制失败:', err);
      alert('复制失败，请手动复制');
    });
  }

  saveToHistory(item) {
    let history = JSON.parse(localStorage.getItem('music_history') || '[]');
    history.unshift(item);
    if (history.length > 20) history = history.slice(0, 20); // 只保留最近20条
    localStorage.setItem('music_history', JSON.stringify(history));
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AIMusicStudio();
});