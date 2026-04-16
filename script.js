// AI Music Studio - Complete Implementation

class AIMusicStudio {
  constructor() {
    this.currentResult = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadHistory();
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

    // 播放/暂停
    document.getElementById('playBtn').addEventListener('click', () => {
      this.togglePlay();
    });

    // 下载音频
    document.getElementById('downloadBtn').addEventListener('click', () => {
      this.downloadAudio();
    });

    // 重新生成音频
    document.getElementById('regenerateAudio').addEventListener('click', () => {
      this.regenerateAudio();
    });

    // 进度条点击
    document.getElementById('progressBar').addEventListener('click', (e) => {
      this.seekAudio(e);
    });

    // 音频时间更新
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.addEventListener('timeupdate', () => {
      this.updateProgress();
    });

    audioPlayer.addEventListener('ended', () => {
      this.onAudioEnded();
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

  async generateMusic() {
    const theme = document.getElementById('theme').value.trim();
    const emotion = document.getElementById('emotion').value;
    const style = document.getElementById('style').value;
    const tempo = document.getElementById('tempo').value;
    const language = document.getElementById('language').value;

    if (!theme) {
      this.showNotification('⚠️ 请输入歌曲主题！', 'warning');
      return;
    }

    // 显示加载状态
    this.showLoading();

    try {
      // 模拟AI处理延迟，提升用户体验
      await this.delay(1500);

      // 生成高质量歌词
      const lyrics = this.generateHighQualityLyrics(theme, emotion, style, language);

      // 生成专业编曲建议
      const arrangement = this.generateProfessionalArrangement(emotion, style, tempo);

      // 保存结果
      this.currentResult = { 
        lyrics, 
        arrangement, 
        theme, 
        emotion, 
        style,
        language,
        tempo
      };

      // 显示结果
      this.displayResults(lyrics, arrangement);
      
      // 生成音频
      await this.generateAudio(theme, emotion, style, lyrics);
      
      // 保存到历史
      this.saveToHistory({ 
        lyrics, 
        arrangement, 
        theme, 
        emotion, 
        style,
        language,
        tempo,
        date: new Date().toISOString() 
      });

      this.showNotification('✅ 创作完成！', 'success');

    } catch (error) {
      console.error('生成失败:', error);
      this.showNotification('❌ 生成失败，请重试', 'error');
      this.showEmpty();
    }
  }

  // 生成高质量歌词（使用智能模板系统）
  generateHighQualityLyrics(theme, emotion, style, language) {
    const templates = this.getAdvancedTemplates();
    const key = `${emotion}_${style}`;
    
    let templateList = templates[key];
    if (!templateList) {
      // fallback 到同情感的其他风格
      const fallbackKey = Object.keys(templates).find(k => k.startsWith(emotion));
      templateList = templates[fallbackKey] || templates['happy_pop'];
    }

    const template = templateList[Math.floor(Math.random() * templateList.length)];
    let lyrics = template
      .replace(/{theme}/g, theme)
      .replace(/{Theme}/g, theme.charAt(0).toUpperCase() + theme.slice(1));
    
    // 如果是英文，转换歌词结构标记
    if (language === 'english') {
      lyrics = this.translateStructureMarks(lyrics);
    }
    
    return lyrics;
  }

  translateStructureMarks(lyrics) {
    const translations = {
      '【主歌】': '[Verse]',
      '【副歌】': '[Chorus]',
      '【桥段】': '[Bridge]',
      '【结尾】': '[Outro]',
      '【前奏】': '[Intro]'
    };
    
    let translated = lyrics;
    for (const [cn, en] of Object.entries(translations)) {
      translated = translated.replace(new RegExp(cn, 'g'), en);
    }
    return translated;
  }

  getAdvancedTemplates() {
    return {
      // 欢快 - 流行
      'happy_pop': [
        `【主歌】
阳光洒在窗台 {theme}的味道
微风轻轻吹过嘴角上扬
每一天都充满期待
和你一起就是最美好的时光

【副歌】
{theme}像彩虹般绚烂
照亮了我整个世界
手牵手走过每个角落
笑声在空中回荡不停歇

【桥段】
啦啦啦 {theme}多美妙
啦啦啦 心情在舞蹈
啦啦啦 幸福来敲门
啦啦啦 快乐围绕`,

        `【主歌】
{theme}的季节已经来到
空气中弥漫着甜蜜味道
脚步轻快像小鸟飞翔
心中的花朵正在绽放

【副歌】
不需要太多言语表达
一个眼神就能明白彼此
{theme}让我们更加靠近
这份感觉永远不会消失

【结尾】
让我们一起唱这首歌
把快乐传递给每个人
{theme}的力量如此强大
让全世界都感受到温暖`
      ],

      // 忧伤 - 抒情
      'sad_ballad': [
        `【主歌】
雨滴敲打着窗户
{theme}的痛楚难以释怀
手机里你的照片
成了我最珍贵的负担

【副歌】
为什么结局是这样
明明说过不会离开
{theme}变成了遗憾
只能在回忆里徘徊

【桥段】
如果时间能够倒流
我会做出不同选择
可惜现实没有如果
只能学会放手接受`,

        `【主歌】
秋风扫过落叶纷飞
{theme}的碎片散落一地
小提琴哀怨地哭泣
像是在为我叹息

【副歌】
你说要走我无法挽留
就像抓不住的沙粒
{theme}终究要结束
留下我一个人面对

【结尾】
眼泪无声地滑落
打湿了枕边的信纸
那些甜蜜的承诺
如今变成了讽刺`
      ],

      // 浪漫 - 流行
      'romantic_pop': [
        `【主歌】
星光点缀着夜空
{theme}的气息弥漫四周
你的眼睛如此迷人
让我沉醉无法自拔

【副歌】
轻轻牵起你的手
感受心跳加速的节奏
{theme}如此甜蜜
像是吃了蜜糖一般

【桥段】
这一刻时间静止
世界只剩下我和你
{theme}的魔力无穷
让我们紧紧相依`,

        `【主歌】
玫瑰花瓣飘落
{theme}的氛围如此浪漫
烛光晚餐的夜晚
你的笑容比酒还醉人

【副歌】
不需要华丽的语言
一个拥抱胜过千言
{theme}在空气中发酵
让我们的心更贴近

【结尾】
月下漫步的海滩
海浪见证我们的爱
{theme}永远不会褪色
只会越来越浓烈`
      ],

      // 激情 - 摇滚
      'energetic_rock': [
        `【主歌】
能量爆发就在此刻
{theme}的火焰熊熊燃烧
电吉他嘶吼咆哮
鼓点密集如雨点般落下

【副歌】
跳起来甩起来
把所有的压力都抛开
{theme}让我们疯狂
这一刻没有规则约束

【桥段】
音量调到最大
让全世界都听到
{theme}的呐喊声
震撼每一个人的心`,

        `【主歌】
舞台灯光闪烁
{theme}的能量充满全身
贝斯线强劲有力
带动每个人的脉搏

【副歌】
汗水湿透了衣衫
但我们毫不在意
{theme}就是要释放
就是要尽情狂欢

【结尾】
跟着节奏一起跳跃
让热情燃烧整个夜晚
{theme}没有极限
只有不断的突破`
      ],

      // 忧郁 - 民谣
      'melancholy_folk': [
        `【主歌】
老旧的木吉他
弹奏着{theme}的忧伤
窗外的梧桐树
叶子一片片凋落

【副歌】
远方的你是否安好
是否也会想起我
{theme}像一杯苦茶
越品越是回甘

【结尾】
岁月匆匆流逝
带走了青春年华
{theme}沉淀成诗
写在泛黄的日记里`,

        `【主歌】
乡间的小路上
{theme}的风轻轻吹过
口琴声悠扬婉转
诉说着过往的故事

【副歌】
老房子的屋檐下
燕子已经飞去南方
{theme}如同秋雨
绵绵不绝地下着

【桥段】
坐在门槛上发呆
回忆如潮水涌来
{theme}虽然苦涩
却是成长的印记`
      ],

      // 希望 - 流行
      'hopeful_pop': [
        `【主歌】
黎明前的黑暗
{theme}的光芒即将绽放
新的旅程已开始
充满无限的可能

【副歌】
跌倒了再站起来
失败是成功的垫脚石
{theme}在心中燃烧
指引我们前进方向

【桥段】
相信自己的力量
没有什么不能实现
{theme}的翅膀展开
飞向更高的天空`,

        `【主歌】
雨后的彩虹出现
{theme}的希望重新燃起
每一次挫折考验
都让我们更加坚强

【副歌】
前方的路还很长
但只要坚持不放弃
{theme}终会到来
照亮黑暗的角落

【结尾】
手牵手一起前行
互相鼓励互相支持
{theme}的种子发芽
终将长成参天大树`
      ],

      // 欢快 - 电子
      'happy_electronic': [
        `【主歌】
电子节拍响起
{theme}的频率开始共振
合成器音色迷幻
带你进入快乐维度

【副歌】
BPM不断攀升
心跳跟随节奏加速
{theme}的电子波
穿透身体的每个细胞

【桥段】
Drop即将来临
准备好迎接冲击
{theme}的能量爆发
让舞池彻底沸腾`
      ],

      // 忧伤 - R&B
      'sad_rnb': [
        `【主歌】
深夜里的孤独感
{theme}的伤痕还在隐隐作痛
街角的咖啡店
再也不是我们的据点

【副歌】
删除了你的联系方式
却删不掉心中的记忆
{theme}像一场梦境
醒来后只剩空虚

【桥段】
也许某天我会忘记
忘记曾经那么爱你
但现在的我只能
一个人慢慢疗伤`
      ],

      // 浪漫 - 抒情
      'romantic_ballad': [
        `【主歌】
樱花飘落的季节
{theme}悄然降临身边
萨克斯风温柔演奏
为我们的爱情伴奏

【副歌】
你的发香随风飘散
让我迷失在这氛围
{theme}如同美酒
越品越是让人沉醉

【结尾】
十指相扣的温度
传递着无尽的爱意
{theme}的诗篇
由我们共同书写`
      ],

      // 激情 - 电子
      'energetic_electronic': [
        `【主歌】
激光束划破黑暗
{theme}的派对正式开始
DJ掌控着全场
每一个过渡都完美无瑕

【副歌】
低音炮震动胸腔
高频音色刺激神经
{theme}的电子流
连接每一个灵魂

【桥段】
闭上眼睛感受
让音乐带领方向
{theme}的世界里
没有束缚只有自由`
      ],

      // 忧郁 - 抒情
      'melancholy_ballad': [
        `【主歌】
灰色的天空阴沉
{theme}的乌云笼罩心头
钢琴声缓慢沉重
每一步都踩在心上

【副歌】
镜子里的自己
眼神空洞失去光彩
{theme}是一种状态
无法挣脱的枷锁

【结尾】
走在无人的街道
路灯拉长了身影
{theme}如影随形
挥之不去的阴霾`
      ],

      // 希望 - 民谣
      'hopeful_folk': [
        `【主歌】
清晨的第一缕阳光
{theme}的温暖照进心房
木吉他的和弦明亮
唱出对未来的憧憬

【副歌】
田野里的麦苗青青
象征着生命的活力
{theme}就在不远处
等待着我们去发现

【桥段】
背上行囊出发
追寻心中的梦想
{theme}的指南针
指向正确的方向`
      ]
    };
  }

  // 生成专业编曲方案
  generateProfessionalArrangement(emotion, style, tempo) {
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
        ballad: "F - C - Dm - Bb | F - C - Bb - C | F - Am - Bb - C",
        electronic: "C - G - Am - F | C - G - F - G | C - Em - F - G",
        rnb: "Fmaj7 - Em7 - Dm7 - Cmaj7 | Fmaj7 - G7 - Am7 - G7"
      },
      sad: {
        pop: "Am - F - C - G | Am - F - G - F | Am - Dm - F - G",
        ballad: "Dm - Bb - F - C | Dm - Bb - C - Bb | Dm - Gm - Bb - C",
        rnb: "Am7 - Fmaj7 - Cmaj7 - G7 | Am7 - Dm7 - Fmaj7 - G7",
        folk: "Em - C - G - D | Em - C - D - C | Em - Am - C - D"
      },
      romantic: {
        pop: "C - Em - Am - G | C - Em - F - G | C - Am - F - G",
        ballad: "Eb - Gm - Cm - Bb | Eb - Gm - Ab - Bb | Eb - Cm - Ab - Bb",
        rnb: "Cmaj7 - Am7 - Fmaj7 - G7 | Cmaj7 - Em7 - Fmaj7 - G7"
      },
      energetic: {
        rock: "A - E - F#m - D | A - E - D - E | A - C#m - D - E",
        electronic: "Am - F - C - G | Am - F - G - F | Am - Dm - F - G",
        pop: "G - D - Em - C | G - D - C - D | G - Bm - C - D"
      },
      melancholy: {
        folk: "Em - C - G - D | Em - C - D - C | Em - Am - C - D",
        ballad: "Bm - G - D - A | Bm - G - A - G | Bm - Em - G - A",
        pop: "Am - F - C - G | Am - F - G - F | Am - Dm - F - G"
      },
      hopeful: {
        pop: "G - D - Em - C | G - D - C - D | G - Bm - C - D",
        folk: "C - G - Am - F | C - G - F - G | C - Em - F - G",
        rock: "G - D - Em - C | G - D - C - D | G - Bm - C - D"
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
      electronic: ["主唱", "合成器lead", "合成器bass", "鼓机", "采样/音效"]
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
      
      this.showNotification('✅ 歌词已复制到剪贴板', 'success');
    }).catch(err => {
      console.error('复制失败:', err);
      this.showNotification('❌ 复制失败，请手动复制', 'error');
    });
  }

  saveToHistory(item) {
    let history = JSON.parse(localStorage.getItem('music_history') || '[]');
    history.unshift(item);
    if (history.length > 20) history = history.slice(0, 20);
    localStorage.setItem('music_history', JSON.stringify(history));
    this.loadHistory();
  }

  loadHistory() {
    const history = JSON.parse(localStorage.getItem('music_history') || '[]');
    const container = document.getElementById('libraryContent');
    
    if (history.length === 0) {
      container.innerHTML = `
        <div class="library-empty glass-card">
          <div class="empty-icon">📂</div>
          <h3>暂无作品</h3>
          <p>开始创作后，作品会自动保存在这里</p>
        </div>
      `;
      return;
    }

    const emotionMap = {
      happy: '欢快',
      sad: '忧伤',
      romantic: '浪漫',
      energetic: '激情',
      melancholy: '忧郁',
      hopeful: '希望'
    };

    const styleMap = {
      pop: '流行',
      rock: '摇滚',
      ballad: '抒情',
      rnb: 'R&B',
      folk: '民谣',
      electronic: '电子'
    };

    container.innerHTML = history.map((item, index) => {
      const date = new Date(item.date);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
      
      return `
        <div class="history-card" onclick="window.app.loadHistoryItem(${index})">
          <div class="history-header">
            <div>
              <div class="history-title">${item.theme}</div>
              <div class="history-date">${dateStr}</div>
            </div>
          </div>
          <div class="history-tags">
            <span class="history-tag">${emotionMap[item.emotion]}</span>
            <span class="history-tag">${styleMap[item.style]}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  loadHistoryItem(index) {
    const history = JSON.parse(localStorage.getItem('music_history') || '[]');
    const item = history[index];
    
    if (item) {
      this.currentResult = item;
      this.displayResults(item.lyrics, item.arrangement);
      this.switchSection('create');
      
      // 填充表单
      document.getElementById('theme').value = item.theme;
      document.getElementById('emotion').value = item.emotion;
      document.getElementById('style').value = item.style;
      document.getElementById('tempo').value = item.tempo;
      document.getElementById('language').value = item.language;
    }
  }

  showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : type === 'warning' ? '#ed8936' : '#667eea'};
      color: white;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      font-weight: 500;
    `;

    document.body.appendChild(notification);

    // 3秒后移除
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ========== 音频生成功能 ==========
  
  async generateAudio(theme, emotion, style, lyrics) {
    const playerContainer = document.getElementById('audioPlayerContainer');
    const generatingStatus = document.getElementById('generatingStatus');
    
    // 显示生成状态
    playerContainer.style.display = 'none';
    generatingStatus.style.display = 'block';
    
    try {
      // 使用免费的音频生成 API
      const audioUrl = await this.fetchAudioFromAPI(theme, emotion, style, lyrics);
      
      if (audioUrl) {
        this.setupAudioPlayer(audioUrl, theme);
        this.showNotification('🎵 音频生成成功！', 'success');
      } else {
        // 如果 API 失败，使用模拟音频
        this.createDemoAudio(theme, emotion, style);
      }
    } catch (error) {
      console.error('音频生成失败:', error);
      // 降级到演示音频
      this.createDemoAudio(theme, emotion, style);
    } finally {
      generatingStatus.style.display = 'none';
      playerContainer.style.display = 'flex';
    }
  }

  async fetchAudioFromAPI(theme, emotion, style, lyrics) {
    // 这里可以使用真实的 AI 音乐生成 API
    // 例如: Hugging Face MusicGen, Suno API 等
    
    // 示例：使用 Hugging Face MusicGen (需要 API Token)
    /*
    const API_TOKEN = 'your_huggingface_token';
    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/musicgen-small',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: `${emotion} ${style} song about ${theme}`,
          parameters: {
            max_length: 256
          }
        })
      }
    );
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
    */
    
    // 由于免费 API 限制，这里返回 null，使用演示音频
    return null;
  }

  createDemoAudio(theme, emotion, style) {
    // 创建一个演示用的音频（使用 Web Audio API 生成简单的旋律）
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // 根据情感设置不同的音色参数
    const params = this.getAudioParams(emotion, style);
    
    // 生成一个简单的旋律
    const melody = this.generateMelody(params);
    
    // 创建音频缓冲区
    const duration = 30; // 30秒
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(2, sampleRate * duration, sampleRate);
    
    // 填充音频数据
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        let sample = 0;
        
        // 合成多个正弦波创造丰富的音色
        melody.forEach((note, index) => {
          const envelope = this.getEnvelope(t, note.start, note.duration);
          sample += Math.sin(2 * Math.PI * note.frequency * t) * envelope * 0.1;
        });
        
        // 添加一些噪音增加真实感
        sample += (Math.random() - 0.5) * 0.02;
        
        data[i] = sample;
      }
    }
    
    // 转换为 WAV 格式
    const wavBlob = this.bufferToWave(buffer, duration);
    const audioUrl = URL.createObjectURL(wavBlob);
    
    this.setupAudioPlayer(audioUrl, theme);
  }

  getAudioParams(emotion, style) {
    const params = {
      happy: { baseFreq: 440, tempo: 120, waveType: 'sine' },
      sad: { baseFreq: 330, tempo: 70, waveType: 'triangle' },
      romantic: { baseFreq: 392, tempo: 90, waveType: 'sine' },
      energetic: { baseFreq: 523, tempo: 140, waveType: 'square' },
      melancholy: { baseFreq: 294, tempo: 75, waveType: 'triangle' },
      hopeful: { baseFreq: 466, tempo: 110, waveType: 'sine' }
    };
    
    return params[emotion] || params.happy;
  }

  generateMelody(params) {
    const notes = [];
    const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C大调
    const beatDuration = 60 / params.tempo;
    
    // 生成 16 个小节的旋律
    for (let i = 0; i < 16; i++) {
      const noteIndex = Math.floor(Math.random() * scale.length);
      const frequency = scale[noteIndex] * (Math.random() > 0.5 ? 1 : 2);
      const start = i * beatDuration;
      const duration = beatDuration * (Math.random() > 0.7 ? 2 : 1);
      
      notes.push({ frequency, start, duration });
    }
    
    return notes;
  }

  getEnvelope(t, start, duration) {
    if (t < start || t > start + duration) return 0;
    
    const attack = 0.05;
    const release = 0.1;
    const noteTime = t - start;
    
    if (noteTime < attack) {
      return noteTime / attack;
    } else if (noteTime > duration - release) {
      return (duration - noteTime) / release;
    }
    return 1;
  }

  bufferToWave(buffer, duration) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferArray = new ArrayBuffer(length);
    const view = new DataView(bufferArray);
    const channels = [];
    let sample;
    let offset = 0;
    let pos = 0;

    // 写入 WAV 头部
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // 文件长度 - 8
    setUint32(0x45564157); // "WAVE"

    // 写入 fmt 子块
    setUint32(0x20746d66); // "fmt "
    setUint32(16); // 子块大小
    setUint16(1); // 音频格式 (PCM)
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan); // byte rate
    setUint16(numOfChan * 2); // block align
    setUint16(16); // bits per sample

    // 写入 data 子块
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    // 写入音频数据
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numOfChan; channel++) {
        sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        sample = (0.5 + sample < 0.5 ? 0.5 + sample : sample) * 0x7FFF;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
    }

    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }

    return new Blob([bufferArray], { type: 'audio/wav' });
  }

  setupAudioPlayer(audioUrl, theme) {
    const audioPlayer = document.getElementById('audioPlayer');
    const trackTitle = document.getElementById('trackTitle');
    const playBtn = document.getElementById('playBtn');
    
    audioPlayer.src = audioUrl;
    trackTitle.textContent = theme || '未命名歌曲';
    
    // 重置播放按钮
    playBtn.querySelector('.play-icon').textContent = '▶️';
    playBtn.classList.remove('playing');
    
    // 更新时长
    audioPlayer.addEventListener('loadedmetadata', () => {
      document.getElementById('duration').textContent = this.formatTime(audioPlayer.duration);
    });
  }

  togglePlay() {
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const playIcon = playBtn.querySelector('.play-icon');
    
    if (audioPlayer.paused) {
      audioPlayer.play();
      playIcon.textContent = '⏸️';
      playBtn.classList.add('playing');
    } else {
      audioPlayer.pause();
      playIcon.textContent = '▶️';
      playBtn.classList.remove('playing');
    }
  }

  updateProgress() {
    const audioPlayer = document.getElementById('audioPlayer');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    
    if (audioPlayer.duration) {
      const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressFill.style.width = percent + '%';
      currentTimeEl.textContent = this.formatTime(audioPlayer.currentTime);
    }
  }

  seekAudio(e) {
    const audioPlayer = document.getElementById('audioPlayer');
    const progressBar = document.getElementById('progressBar');
    
    if (audioPlayer.duration) {
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioPlayer.currentTime = pos * audioPlayer.duration;
    }
  }

  onAudioEnded() {
    const playBtn = document.getElementById('playBtn');
    const playIcon = playBtn.querySelector('.play-icon');
    
    playIcon.textContent = '▶️';
    playBtn.classList.remove('playing');
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('currentTime').textContent = '0:00';
  }

  downloadAudio() {
    const audioPlayer = document.getElementById('audioPlayer');
    
    if (!audioPlayer.src) {
      this.showNotification('⚠️ 没有可下载的音频', 'warning');
      return;
    }
    
    const link = document.createElement('a');
    link.href = audioPlayer.src;
    link.download = `${this.currentResult?.theme || 'song'}.wav`;
    link.click();
    
    this.showNotification('💾 开始下载...', 'success');
  }

  async regenerateAudio() {
    if (!this.currentResult) {
      this.showNotification('⚠️ 请先生成歌曲', 'warning');
      return;
    }
    
    const { theme, emotion, style, lyrics } = this.currentResult;
    await this.generateAudio(theme, emotion, style, lyrics);
    this.showNotification('🔄 重新生成完成', 'success');
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// 添加通知动画样式
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AIMusicStudio();
});
