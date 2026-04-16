// AI Music Agents - Multi-Agent System Implementation

class LyricsAgent {
    constructor() {
        this.status = 'idle';
        this.result = null;
    }

    async generate(params) {
        this.setStatus('working');
        await this.delay(1500);

        const { theme, emotion, genre, keywords, language } = params;
        const lyrics = this.createLyrics(theme, emotion, genre, keywords, language);
        
        this.result = lyrics;
        this.setStatus('complete');
        return lyrics;
    }

    createLyrics(theme, emotion, genre, keywords, language) {
        const templates = this.getTemplates();
        const key = `${emotion}_${genre}`;
        let templateList = templates[key] || templates['happy_pop'];
        const template = templateList[Math.floor(Math.random() * templateList.length)];
        
        let lyrics = template.replace(/{theme}/g, theme);
        
        if (keywords) {
            const keywordList = keywords.split(/[,，]/).map(k => k.trim()).filter(k => k);
            keywordList.forEach((kw, i) => {
                lyrics = lyrics.replace(new RegExp(`{keyword${i}}`, 'g'), kw);
            });
        }

        const header = `【歌曲信息】
主题：${theme}
情绪：${this.getEmotionName(emotion)}
风格：${this.getGenreName(genre)}
语言：${language === 'chinese' ? '中文' : 'English'}

`;

        return header + lyrics;
    }

    getTemplates() {
        return {
            'happy_pop': [
                `【主歌1】
阳光洒在窗台 {theme}的味道
微风轻轻吹过嘴角上扬
每一天都充满期待
和你一起就是最美好的时光

【主歌2】
不需要太多言语表达
一个眼神就能明白彼此
{keyword0}在心中闪耀
这份感觉永远不会消失

【预副歌】
啦啦啦 心情在舞蹈
啦啦啦 幸福来敲门

【副歌】
{theme}像彩虹般绚烂
照亮了我整个世界
手牵手走过每个角落
笑声在空中回荡不停歇
{keyword1}让爱更浓烈

【桥段】
这一刻时间静止
世界只剩下我和你
{theme}的魔力无穷
让我们紧紧相依

【尾奏】
啦啦啦 {theme}多美妙
啦啦啦 快乐围绕`,

                `{theme}的季节已经来到
空气中弥漫着甜蜜味道
脚步轻快像小鸟飞翔
心中的花朵正在绽放

【副歌】
让我们一起唱这首歌
把快乐传递给每个人
{theme}的力量如此强大
让全世界都感受到温暖`
            ],

            'sad_ballad': [
                `【主歌1】
雨滴敲打着窗户
{theme}的痛楚难以释怀
手机里你的照片
成了我最珍贵的负担

【主歌2】
深夜里的孤独感
伤痕还在隐隐作痛
街角的咖啡店
再也不是我们的据点

【预副歌】
如果时间能够倒流
我会做出不同选择

【副歌】
为什么结局是这样
明明说过不会离开
{theme}变成了遗憾
只能在回忆里徘徊
{keyword0}刺痛了心

【桥段】
也许某天我会忘记
忘记曾经那么爱你
但现在的我只能
一个人慢慢疗伤

【尾奏】
{theme}随风而去
留下无尽的思念`,

                `秋风扫过落叶纷飞
{theme}的碎片散落一地
小提琴哀怨地哭泣
像是在为我叹息

【副歌】
眼泪无声地滑落
打湿了枕边的信纸
那些甜蜜的承诺
如今变成了讽刺`
            ],

            'romantic_pop': [
                `【主歌1】
星光点缀着夜空
{theme}的气息弥漫四周
你的眼睛如此迷人
让我沉醉无法自拔

【主歌2】
玫瑰花瓣飘落
浪漫的氛围如此美好
烛光晚餐的夜晚
你的笑容比酒还醉人

【预副歌】
心跳加速的节奏
无法抗拒的吸引力

【副歌】
轻轻牵起你的手
感受{theme}的甜蜜
像是吃了蜜糖一般
这一刻永远铭记
{keyword0}见证爱情

【桥段】
月下漫步的海滩
海浪见证我们的爱
{theme}永远不会褪色
只会越来越浓烈

【尾奏】
{theme}永恒不变
爱你到永远`,

                `{theme}悄然降临身边
萨克斯风温柔演奏
为我们的爱情伴奏

【副歌】
十指相扣的温度
传递着无尽的爱意
{theme}的诗篇
由我们共同书写`
            ],

            'energetic_rock': [
                `【主歌1】
能量爆发就在此刻
{theme}的火焰熊熊燃烧
电吉他嘶吼咆哮
鼓点密集如雨点般落下

【主歌2】
舞台灯光闪烁
能量充满全身
贝斯线强劲有力
带动每个人的脉搏

【预副歌】
准备好了吗
让我们一起疯狂

【副歌】
跳起来甩起来
把所有的压力都抛开
{theme}让我们疯狂
这一刻没有规则约束
{keyword0}点燃激情

【桥段】
音量调到最大
让全世界都听到
{theme}的呐喊声
震撼每一个人的心

【尾奏】
{theme}永不熄灭
摇滚精神万岁`,

                `跟着节奏一起跳跃
让热情燃烧整个夜晚
{theme}没有极限
只有不断的突破`
            ],

            'melancholy_folk': [
                `【主歌1】
老旧的木吉他
弹奏着{theme}的忧伤
窗外的梧桐树
叶子一片片凋落

【主歌2】
乡间的小路上
风轻轻吹过
口琴声悠扬婉转
诉说着过往的故事

【预副歌】
远方的你是否安好
是否也会想起我

【副歌】
{theme}像一杯苦茶
越品越是回甘
岁月匆匆流逝
带走了青春年华
{keyword0}沉淀成诗

【桥段】
坐在门槛上发呆
回忆如潮水涌来
虽然苦涩
却是成长的印记

【尾奏】
{theme}写在日记里
成为永恒的回忆`,

                `{theme}如同秋雨
绵绵不绝地下着
老房子的屋檐下
燕子已经飞去南方`
            ],

            'hopeful_pop': [
                `【主歌1】
黎明前的黑暗
{theme}的光芒即将绽放
新的旅程已开始
充满无限的可能

【主歌2】
雨后的彩虹出现
希望重新燃起
每一次挫折考验
都让我们更加坚强

【预副歌】
相信自己的力量
没有什么不能实现

【副歌】
跌倒了再站起来
失败是成功的垫脚石
{theme}在心中燃烧
指引我们前进方向
{keyword0}带来光明

【桥段】
前方的路还很长
但只要坚持不放弃
终会到来
照亮黑暗的角落

【尾奏】
{theme}展翅高飞
梦想终将实现`,

                `手牵手一起前行
互相鼓励互相支持
{theme}的种子发芽
终将长成参天大树`
            ]
        };
    }

    getEmotionName(emotion) {
        const map = {
            happy: '欢快', sad: '忧伤', romantic: '浪漫',
            energetic: '激情', melancholy: '忧郁', hopeful: '希望'
        };
        return map[emotion] || emotion;
    }

    getGenreName(genre) {
        const map = {
            pop: '流行', rock: '摇滚', ballad: '抒情',
            rnb: 'R&B', folk: '民谣', electronic: '电子'
        };
        return map[genre] || genre;
    }

    setStatus(status) {
        this.status = status;
        this.updateUI();
    }

    updateUI() {
        const navItem = document.querySelector('[data-agent="lyrics"]');
        const card = document.getElementById('lyricsAgentCard');
        if (navItem && card) {
            const statusEl = navItem.querySelector('.agent-status');
            const indicator = card.querySelector('.status-indicator');
            
            statusEl.className = `agent-status status-${this.status}`;
            statusEl.textContent = this.getStatusText(this.status);
            indicator.className = `status-indicator status-${this.status}`;
            indicator.textContent = this.getStatusText(this.status);
        }
    }

    getStatusText(status) {
        const map = { idle: '待命', working: '创作中', complete: '已完成' };
        return map[status] || status;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class ArrangementAgent {
    constructor() {
        this.status = 'idle';
        this.result = null;
    }

    async generate(params) {
        this.setStatus('working');
        await this.delay(1500);

        const { bpm, key, lyricsRef, emotion, genre } = params;
        const arrangement = this.createArrangement(bpm, key, lyricsRef, emotion, genre);
        
        this.result = arrangement;
        this.setStatus('complete');
        return arrangement;
    }

    createArrangement(bpm, key, lyricsRef, emotion, genre) {
        const chordProg = this.getChordProgression(emotion, genre, key);
        const instruments = this.getInstruments(genre, emotion);
        const structure = this.getStructure(genre);

        return `【编曲方案】

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎹 基础信息
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
曲风定位：${this.getGenreName(genre)} / ${this.getEmotionName(emotion)}
调式调性：${key} ${key.includes('m') ? '小调' : '大调'}
BPM速度：${bpm}
拍号：4/4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎼 和弦进行
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【主歌部分】
${chordProg.verse}

【副歌部分】
${chordProg.chorus}

【桥段部分】
${chordProg.bridge}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎸 段落乐器编排
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【主歌 Verse】
${instruments.verse}

【预副歌 Pre-Chorus】
${instruments.preChorus}

【副歌 Chorus】
${instruments.chorus}

【桥段 Bridge】
${instruments.bridge}

【尾奏 Outro】
${instruments.outro}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🥁 节奏型与律动
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

鼓组节奏：${this.getDrumPattern(genre, bpm)}
贝斯线条：${this.getBassLine(genre)}
律动特点：${this.getGroove(emotion, bpm)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ 氛围描述
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${this.getAtmosphere(emotion, genre)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 制作建议
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${this.getProductionTips(emotion, genre)}
`;
    }

    getChordProgression(emotion, genre, key) {
        const progressions = {
            happy: {
                verse: `${key} - ${this.getRelative(key, 5)} - ${this.getMinor(key)} - ${this.getRelative(key, 4)} | 重复2次`,
                chorus: `${key} - ${this.getRelative(key, 5)} - ${this.getRelative(key, 4)} - ${this.getRelative(key, 5)} | ${key} - ${this.getMinor(key, 3)} - ${this.getRelative(key, 4)} - ${this.getRelative(key, 5)}`,
                bridge: `${this.getRelative(key, 4)} - ${key} - ${this.getRelative(key, 5)} - ${this.getMinor(key)}`
            },
            sad: {
                verse: `${this.getMinor(key)} - ${this.getRelative(key, 4)} - ${key} - ${this.getRelative(key, 5)}`,
                chorus: `${this.getMinor(key)} - ${this.getRelative(key, 4)} - ${this.getRelative(key, 5)} - ${this.getRelative(key, 4)}`,
                bridge: `${this.getRelative(key, 6)} - ${this.getRelative(key, 4)} - ${this.getMinor(key)} - ${this.getRelative(key, 5)}`
            },
            romantic: {
                verse: `${key}maj7 - ${this.getMinor(key, 3)}m7 - ${this.getRelative(key, 4)}maj7 - ${this.getRelative(key, 5)}7`,
                chorus: `${key}maj7 - ${this.getRelative(key, 5)}7 - ${this.getRelative(key, 4)}maj7 - ${this.getRelative(key, 5)}7`,
                bridge: `${this.getRelative(key, 4)}maj7 - ${this.getMinor(key, 2)}m7 - ${this.getMinor(key, 3)}m7 - ${this.getRelative(key, 5)}7`
            },
            energetic: {
                verse: `${key} - ${this.getRelative(key, 5)} - ${this.getMinor(key, 6)} - ${this.getRelative(key, 4)}`,
                chorus: `${key} - ${this.getRelative(key, 5)} - ${this.getRelative(key, 4)} - ${this.getRelative(key, 5)}`,
                bridge: `${this.getRelative(key, 4)} - ${key} - ${this.getRelative(key, 5)} - ${this.getMinor(key, 6)}`
            },
            melancholy: {
                verse: `${this.getMinor(key)} - ${this.getRelative(key, 6)} - ${this.getRelative(key, 4)} - ${this.getRelative(key, 5)}`,
                chorus: `${this.getMinor(key)} - ${this.getRelative(key, 4)} - ${this.getRelative(key, 5)} - ${this.getRelative(key, 6)}`,
                bridge: `${this.getRelative(key, 3)} - ${this.getRelative(key, 6)} - ${this.getMinor(key)} - ${this.getRelative(key, 5)}`
            },
            hopeful: {
                verse: `${key} - ${this.getRelative(key, 5)} - ${this.getMinor(key, 6)} - ${this.getRelative(key, 4)}`,
                chorus: `${key} - ${this.getRelative(key, 5)} - ${this.getRelative(key, 4)} - ${this.getRelative(key, 5)}`,
                bridge: `${this.getRelative(key, 4)} - ${this.getMinor(key, 2)} - ${this.getRelative(key, 5)} - ${this.getMinor(key, 6)}`
            }
        };

        return progressions[emotion] || progressions.happy;
    }

    getInstruments(genre, emotion) {
        const configs = {
            pop: {
                verse: '钢琴（分解和弦）+ 轻鼓（仅踩镲）+ 电贝斯（根音）+ 轻柔Pad铺底',
                preChorus: '加入弦乐长音 + 鼓组渐强 + 吉他轻微扫弦',
                chorus: '全鼓组（强力节奏）+ 弦乐群 + 电吉他扫弦 + 合成器Lead + 贝斯活跃',
                bridge: '减弱至钢琴独奏 + 大提琴独奏旋律 + 逐渐加入弦乐',
                outro: '所有乐器渐弱 + 钢琴单音结束 + 环境音效淡出'
            },
            rock: {
                verse: '节奏电吉他（轻distortion）+ 贝斯 + 鼓组（简洁节奏）',
                preChorus: '吉他加强 + 鼓组加花 + 加入键盘pad',
                chorus: '双电吉他（节奏+主音）+ 强力鼓组 + 贝斯驱动 + 键盘衬托',
                bridge: '吉他solo + 鼓组简化 + 贝斯walking line',
                outro: '全体乐器强奏 + 吉他feedback + 突然停止'
            },
            ballad: {
                verse: '钢琴（主旋律）+ 弦乐四重奏 + 轻柔贝斯',
                preChorus: '加入长笛或单簧管 + 弦乐渐强',
                chorus: '完整弦乐群 + 钢琴加强 + 轻鼓组 + 竖琴装饰',
                bridge: '大提琴独奏 + 钢琴伴奏 + 弦乐颤音',
                outro: '钢琴独奏回归 + 弦乐长音延续 + 渐弱至 silence'
            },
            rnb: {
                verse: 'Rhodes电钢琴 + 轻鼓机 + 贝斯（groovy）+ 轻柔吉他',
                preChorus: '加入合成器pluck + 鼓组复杂化',
                chorus: '完整鼓组 + 多层和声 + 贝斯slap技巧 + 合成器pad',
                bridge: '减少至电钢琴+贝斯 + 加入萨克斯即兴',
                outro: '即兴vocal ad-libs + 乐器逐层退出'
            },
            folk: {
                verse: '原声吉他（指弹）+ 口琴 + 轻打击乐',
                preChorus: '加入小提琴 + 箱鼓加强',
                chorus: '全乐队（吉他扫弦+小提琴+曼陀林+手鼓）',
                bridge: '口琴独奏 + 吉他伴奏',
                outro: '原声吉他独奏 + 自然环境音'
            },
            electronic: {
                verse: '合成器arp + 电子鼓（简约）+ sub bass',
                preChorus: '加入buildup效果 + filter sweep',
                chorus: 'drop部分：强力kick + synth lead + bass wobble',
                bridge: 'breakdown：ambient pad + vocal chop',
                outro: '逐渐减少元素 + reverb tail'
            }
        };

        return configs[genre] || configs.pop;
    }

    getStructure(genre) {
        return ['Intro 前奏 (8小节)', 'Verse 1 主歌 (16小节)', 'Pre-Chorus 预副歌 (8小节)', 
                'Chorus 副歌 (16小节)', 'Verse 2 主歌 (16小节)', 'Pre-Chorus (8小节)',
                'Chorus (16小节)', 'Bridge 桥段 (16小节)', 'Chorus (16小节)', 'Outro 尾奏 (8小节)'];
    }

    getDrumPattern(genre, bpm) {
        const patterns = {
            pop: bpm < 100 ? '慢板摇滚节奏，强调2、4拍' : '标准流行节奏，稳定的kick-snare模式',
            rock: '强力的backbeat，密集的hi-hat，频繁的fill',
            ballad: '轻柔的brush或rod，稀疏的kick，注重动态',
            rnb: '复杂的syncopation，ghost notes，开放的hi-hat',
            folk: '简约的手鼓或cajón，自然的swing感',
            electronic: '四-on-the-floor kick，快速的hi-hat，强烈的snare'
        };
        return patterns[genre] || patterns.pop;
    }

    getBassLine(genre) {
        const lines = {
            pop: '跟随和弦根音，八分音符为主，偶尔加入passing tone',
            rock: '强力的root-fifth模式，加入slide和hammer-on技巧',
            ballad: '长音符 sustain，强调和弦变化，使用bow技巧',
            rnb: 'groovy的syncopated line，slap和pop技巧，chromatic approach',
            folk: '简单的root-note模式，偶尔加入walking line',
            electronic: 'synthesized sub bass，sidechain压缩，wobble效果'
        };
        return lines[genre] || lines.pop;
    }

    getGroove(emotion, bpm) {
        if (bpm < 90) return '舒缓流畅，注重空间感和呼吸';
        if (bpm < 120) return '中等速度，平衡的节奏推进';
        return '快速激烈，强烈的节奏驱动力';
    }

    getAtmosphere(emotion, genre) {
        const atmospheres = {
            happy: '明亮开阔的氛围，高频丰富，给人向上愉悦的感觉。使用major key的和声色彩，营造阳光般的温暖感。',
            sad: '深沉内敛的氛围，低频突出，空间混响较大。minor key带来忧郁感，留白较多，给情感留出空间。',
            romantic: '温暖亲密的氛围，中频饱满，使用温暖的analog音色。柔和的reverb和delay创造梦幻感。',
            energetic: '紧张刺激的氛围，动态范围大，频率覆盖全面。强烈的transient和compression带来冲击力。',
            melancholy: '怀旧复古的氛围，使用tape saturation和vinyl crackle。朦胧的high-end，突出的mid-range。',
            hopeful: '渐进升华的氛围，从简约到丰满的arrangement。rising melody和ascending harmony带来希望感。'
        };
        return atmospheres[emotion] || atmospheres.happy;
    }

    getProductionTips(emotion, genre) {
        return `1. 根据${this.getEmotionName(emotion)}情绪选择合适的音色和效果器
2. 注意各段落的动态对比，副歌要有明显的提升
3. 合理使用立体声场，避免所有乐器挤在中间
4. 保持频率平衡，使用EQ清理冲突频段
5. ${genre === 'electronic' ? '注重buildup和drop的张力构建' : '重视人声的清晰度和表现力'}
6. 适当使用automation增加变化和趣味
7. 参考同风格经典作品的mix balance`;
    }

    // Helper functions
    getRelative(key, degree) {
        const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const baseKey = key.replace('m', '');
        const index = keys.indexOf(baseKey);
        if (index === -1) return 'F';
        const newIndex = (index + degree - 1) % 12;
        return keys[newIndex];
    }

    getMinor(key, offset = 0) {
        const minorKeys = {
            'C': 'Am', 'G': 'Em', 'D': 'Bm', 'A': 'F#m',
            'Am': 'Am', 'Em': 'Em', 'Dm': 'Dm'
        };
        return minorKeys[key] || key + 'm';
    }

    getEmotionName(emotion) {
        const map = {
            happy: '欢快', sad: '忧伤', romantic: '浪漫',
            energetic: '激情', melancholy: '忧郁', hopeful: '希望'
        };
        return map[emotion] || emotion;
    }

    getGenreName(genre) {
        const map = {
            pop: '流行', rock: '摇滚', ballad: '抒情',
            rnb: 'R&B', folk: '民谣', electronic: '电子'
        };
        return map[genre] || genre;
    }

    setStatus(status) {
        this.status = status;
        this.updateUI();
    }

    updateUI() {
        const navItem = document.querySelector('[data-agent="arrangement"]');
        const card = document.getElementById('arrangementAgentCard');
        if (navItem && card) {
            const statusEl = navItem.querySelector('.agent-status');
            const indicator = card.querySelector('.status-indicator');
            
            statusEl.className = `agent-status status-${this.status}`;
            statusEl.textContent = this.getStatusText(this.status);
            indicator.className = `status-indicator status-${this.status}`;
            indicator.textContent = this.getStatusText(this.status);
        }
    }

    getStatusText(status) {
        const map = { idle: '待命', working: '编曲中', complete: '已完成' };
        return map[status] || status;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class EvaluationAgent {
    constructor() {
        this.status = 'idle';
        this.result = null;
    }

    async evaluate(lyrics, arrangement) {
        this.setStatus('working');
        await this.delay(1200);

        const evaluation = this.performEvaluation(lyrics, arrangement);
        this.result = evaluation;
        this.setStatus('complete');
        return evaluation;
    }

    performEvaluation(lyrics, arrangement) {
        const lyricsScore = this.evaluateLyrics(lyrics);
        const arrangementScore = this.evaluateArrangement(arrangement);
        const totalScore = ((lyricsScore.total + arrangementScore.total) / 2).toFixed(1);

        return {
            lyrics: lyricsScore,
            arrangement: arrangementScore,
            total: totalScore,
            comment: this.generateComment(totalScore, lyricsScore, arrangementScore),
            suggestions: this.generateSuggestions(lyricsScore, arrangementScore)
        };
    }

    evaluateLyrics(lyrics) {
        const rhyme = this.scoreRhyme(lyrics);
        const structure = this.scoreStructure(lyrics);
        const emotion = this.scoreEmotion(lyrics);
        const writing = this.scoreWriting(lyrics);
        const singability = this.scoreSingability(lyrics);

        const total = ((rhyme + structure + emotion + writing + singability) / 5).toFixed(1);

        return {
            rhyme, structure, emotion, writing, singability, total,
            comment: this.getLyricsComment(rhyme, structure, emotion, writing, singability)
        };
    }

    evaluateArrangement(arrangement) {
        const professionalism = this.scoreProfessionalism(arrangement);
        const instrumentation = this.scoreInstrumentation(arrangement);
        const harmony = this.scoreHarmony(arrangement);
        const emotionMatch = this.scoreEmotionMatch(arrangement);
        const structure = this.scoreArrStructure(arrangement);

        const total = ((professionalism + instrumentation + harmony + emotionMatch + structure) / 5).toFixed(1);

        return {
            professionalism, instrumentation, harmony, emotionMatch, structure, total,
            comment: this.getArrangementComment(professionalism, instrumentation, harmony, emotionMatch, structure)
        };
    }

    // Scoring methods (simulated with realistic logic)
    scoreRhyme(lyrics) { return this.randomScore(7, 10); }
    scoreStructure(lyrics) { return this.randomScore(7.5, 9.5); }
    scoreEmotion(lyrics) { return this.randomScore(7, 9.5); }
    scoreWriting(lyrics) { return this.randomScore(6.5, 9); }
    scoreSingability(lyrics) { return this.randomScore(7, 9); }

    scoreProfessionalism(arr) { return this.randomScore(7.5, 9.5); }
    scoreInstrumentation(arr) { return this.randomScore(7, 9); }
    scoreHarmony(arr) { return this.randomScore(7.5, 9.5); }
    scoreEmotionMatch(arr) { return this.randomScore(7, 9.5); }
    scoreArrStructure(arr) { return this.randomScore(7.5, 9); }

    randomScore(min, max) {
        return (Math.random() * (max - min) + min).toFixed(1);
    }

    getLyricsComment(rhyme, structure, emotion, writing, singability) {
        if (rhyme >= 9 && structure >= 9) {
            return '歌词押韵工整，结构严谨，具有很高的专业水准。情感表达真挚，文笔流畅，易于传唱。';
        } else if (rhyme >= 7.5) {
            return '歌词整体质量良好，押韵基本到位，结构清晰。情感表达到位，有一定的文学性。';
        }
        return '歌词基础扎实，有改进空间。建议在押韵技巧和情感深度上继续打磨。';
    }

    getArrangementComment(prof, instr, harm, emot, struct) {
        if (prof >= 9 && instr >= 8.5) {
            return '编曲方案专业度高，配器合理且富有层次。和弦进行流畅，情绪匹配精准，结构层次分明。';
        } else if (prof >= 7.5) {
            return '编曲方案较为专业，乐器配置基本合理。和弦进行稳妥，能有效支撑歌曲情绪。';
        }
        return '编曲方案可行，建议进一步优化乐器搭配和动态变化，增强音乐的表现力。';
    }

    generateComment(total, lyrics, arrangement) {
        if (total >= 9) {
            return '这是一首极具潜力的优秀作品！歌词与编曲高度契合，艺术性和商业性兼具，建议立即投入制作。';
        } else if (total >= 8) {
            return '作品质量优秀，具备很高的完成度。细节处还有提升空间，但整体已非常成熟。';
        } else if (total >= 7) {
            return '作品达到良好水平，框架完整。建议根据评估意见进行针对性优化，可进一步提升品质。';
        }
        return '作品基础尚可，但需要在多个维度进行改进。建议参考优化建议，重新审视创作方向。';
    }

    generateSuggestions(lyrics, arrangement) {
        const suggestions = [];
        
        if (lyrics.rhyme < 8) {
            suggestions.push('• 歌词押韵：建议加强韵脚的统一性，可使用更多内韵和交叉韵');
        }
        if (lyrics.emotion < 8) {
            suggestions.push('• 情感表达：可增加具体的意象和细节描写，让情感更具象化');
        }
        if (arrangement.instrumentation < 8) {
            suggestions.push('• 配器优化：考虑增加特色乐器或音效，丰富音色层次');
        }
        if (arrangement.emotionMatch < 8) {
            suggestions.push('• 情绪匹配：调整某些段落的编曲强度，使其更贴合歌词情绪');
        }

        suggestions.push('• 动态对比：加强主歌与副歌的动态差异，制造更强的听觉冲击');
        suggestions.push('• 记忆点：在副歌部分设计更鲜明的melodic hook，提升传唱度');

        return suggestions;
    }

    formatReport(evalData) {
        return `【作品评估报告】

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 歌词评估
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

押韵工整度：${this.stars(evalData.lyrics.rhyme)} ${evalData.lyrics.rhyme}/10
结构完整性：${this.stars(evalData.lyrics.structure)} ${evalData.lyrics.structure}/10
情感表达力：${this.stars(evalData.lyrics.emotion)} ${evalData.lyrics.emotion}/10
文笔优美度：${this.stars(evalData.lyrics.writing)} ${evalData.lyrics.writing}/10
传唱潜力：  ${this.stars(evalData.lyrics.singability)} ${evalData.lyrics.singability}/10

歌词总分：${evalData.lyrics.total}/10

评语：${evalData.lyrics.comment}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎼 编曲评估
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

专业程度：  ${this.stars(evalData.arrangement.professionalism)} ${evalData.arrangement.professionalism}/10
配器合理性：${this.stars(evalData.arrangement.instrumentation)} ${evalData.arrangement.instrumentation}/10
和弦流畅度：${this.stars(evalData.arrangement.harmony)} ${evalData.arrangement.harmony}/10
情绪匹配度：${this.stars(evalData.arrangement.emotionMatch)} ${evalData.arrangement.emotionMatch}/10
结构层次感：${this.stars(evalData.arrangement.structure)} ${evalData.arrangement.structure}/10

编曲总分：${evalData.arrangement.total}/10

评语：${evalData.arrangement.comment}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 综合评分
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

总评分：${evalData.total}/10 ${this.stars(evalData.total)}

综合评价：
${evalData.comment}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 优化建议
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${evalData.suggestions.join('\n')}
`;
    }

    stars(score) {
        const fullStars = Math.floor(score / 2);
        const halfStar = score % 2 >= 1 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
    }

    setStatus(status) {
        this.status = status;
        this.updateUI();
    }

    updateUI() {
        const navItem = document.querySelector('[data-agent="evaluation"]');
        const card = document.getElementById('evaluationAgentCard');
        if (navItem && card) {
            const statusEl = navItem.querySelector('.agent-status');
            const indicator = card.querySelector('.status-indicator');
            
            statusEl.className = `agent-status status-${this.status}`;
            statusEl.textContent = this.getStatusText(this.status);
            indicator.className = `status-indicator status-${this.status}`;
            indicator.textContent = this.getStatusText(this.status);
        }
    }

    getStatusText(status) {
        const map = { idle: '待命', working: '评估中', complete: '已完成' };
        return map[status] || status;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class AuditAgent {
    constructor() {
        this.status = 'idle';
        this.result = null;
    }

    async audit(lyrics, arrangement, evaluation) {
        this.setStatus('working');
        await this.delay(1000);

        const auditResult = this.performAudit(lyrics, arrangement, evaluation);
        this.result = auditResult;
        this.setStatus('complete');
        return auditResult;
    }

    performAudit(lyrics, arrangement, evaluation) {
        const checks = {
            contentSafety: this.checkContentSafety(lyrics),
            logicConsistency: this.checkLogicConsistency(lyrics, arrangement),
            qualityStandard: this.checkQualityStandard(evaluation),
            originality: this.checkOriginality(lyrics)
        };

        const passed = Object.values(checks).every(c => c.passed);
        const issues = Object.entries(checks)
            .filter(([_, check]) => !check.passed)
            .map(([key, check]) => check.issue);

        return {
            checks,
            passed,
            issues,
            verdict: passed ? '通过' : '需要修改',
            recommendation: this.getRecommendation(passed, issues),
            timestamp: new Date().toLocaleString('zh-CN')
        };
    }

    checkContentSafety(lyrics) {
        const sensitiveWords = ['暴力', '色情', '毒品', '政治敏感'];
        const hasSensitive = sensitiveWords.some(word => lyrics.includes(word));
        
        return {
            name: '内容安全检查',
            passed: !hasSensitive,
            issue: hasSensitive ? '检测到敏感内容，需要修改' : null,
            detail: '检查歌词是否包含违规、低俗、敏感内容'
        };
    }

    checkLogicConsistency(lyrics, arrangement) {
        // Simulate logic check
        const passed = Math.random() > 0.1; // 90% pass rate
        
        return {
            name: '逻辑一致性检查',
            passed,
            issue: !passed ? '歌词与编曲情绪不匹配，建议调整' : null,
            detail: '检查歌词内容与编曲风格的逻辑一致性'
        };
    }

    checkQualityStandard(evaluation) {
        const totalScore = parseFloat(evaluation.total);
        const passed = totalScore >= 6.5;
        
        return {
            name: '质量标准检查',
            passed,
            issue: !passed ? `综合评分${totalScore}低于标准线6.5，需要优化` : null,
            detail: '检查作品是否达到最低质量标准'
        };
    }

    checkOriginality(lyrics) {
        // Simulate originality check
        const passed = Math.random() > 0.05; // 95% pass rate
        
        return {
            name: '原创性检查',
            passed,
            issue: !passed ? '检测到与现有作品相似度过高' : null,
            detail: '检查作品的原创性和独特性'
        };
    }

    getRecommendation(passed, issues) {
        if (passed) {
            return '✅ 作品通过审核，可以存入历史作品库。\n\n建议：\n• 可以考虑进一步优化细节\n• 建议尝试不同的编曲版本\n• 可邀请他人试听获取反馈';
        }
        
        return `⚠️ 作品需要修改后才能通过审核。\n\n发现的问题：\n${issues.map(i => `• ${i}`).join('\n')}\n\n建议：\n• 针对上述问题逐一修改\n• 修改后重新执行审核流程\n• 可参考评估报告的优化建议`;
    }

    formatAuditReport(auditData) {
        return `【审核报告】

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ 审核结果：${auditData.verdict}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

审核时间：${auditData.timestamp}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 审核项目
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${Object.values(auditData.checks).map(check => `
【${check.name}】
状态：${check.passed ? '✅ 通过' : '❌ 未通过'}
说明：${check.detail}${check.issue ? `\n问题：${check.issue}` : ''}
`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 审核结论
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${auditData.recommendation}
`;
    }

    setStatus(status) {
        this.status = status;
        this.updateUI();
    }

    updateUI() {
        const navItem = document.querySelector('[data-agent="audit"]');
        const card = document.getElementById('auditAgentCard');
        if (navItem && card) {
            const statusEl = navItem.querySelector('.agent-status');
            const indicator = card.querySelector('.status-indicator');
            
            statusEl.className = `agent-status status-${this.status}`;
            statusEl.textContent = this.getStatusText(this.status);
            indicator.className = `status-indicator status-${this.status}`;
            indicator.textContent = this.getStatusText(this.status);
        }
    }

    getStatusText(status) {
        const map = { idle: '待命', working: '审核中', complete: '已完成' };
        return map[status] || status;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Main Controller
class MusicAgentsController {
    constructor() {
        this.lyricsAgent = new LyricsAgent();
        this.arrangementAgent = new ArrangementAgent();
        this.evaluationAgent = new EvaluationAgent();
        this.auditAgent = new AuditAgent();
        
        this.currentWork = null;
        this.history = JSON.parse(localStorage.getItem('music_history') || '[]');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateHistoryList();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const agent = e.currentTarget.dataset.agent;
                const view = e.currentTarget.dataset.view;
                
                if (agent) {
                    this.switchAgent(agent);
                } else if (view) {
                    this.switchView(view);
                }
            });
        });

        // Lyrics Agent
        document.getElementById('generateLyricsBtn').addEventListener('click', () => {
            this.handleLyricsGeneration();
        });

        document.getElementById('copyLyricsBtn').addEventListener('click', () => {
            this.copyToClipboard('lyricsOutput');
        });

        // Arrangement Agent
        document.getElementById('generateArrangementBtn').addEventListener('click', () => {
            this.handleArrangementGeneration();
        });

        document.getElementById('copyArrangementBtn').addEventListener('click', () => {
            this.copyToClipboard('arrangementOutput');
        });

        // Evaluation Agent
        document.getElementById('runEvaluationBtn').addEventListener('click', () => {
            this.handleEvaluation();
        });

        // Audit Agent
        document.getElementById('runAuditBtn').addEventListener('click', () => {
            this.handleAudit();
        });

        // Workspace
        document.getElementById('startCreationBtn').addEventListener('click', () => {
            this.startFullWorkflow();
        });

        // History
        document.getElementById('historyBtn').addEventListener('click', () => {
            this.toggleHistory();
        });

        document.getElementById('closeHistory').addEventListener('click', () => {
            this.toggleHistory();
        });

        document.getElementById('overlay').addEventListener('click', () => {
            this.toggleHistory();
        });
    }

    switchAgent(agentName) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.agent === agentName) {
                item.classList.add('active');
            }
        });

        document.querySelectorAll('.agent-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${agentName}Section`).classList.add('active');
    }

    switchView(viewName) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewName) {
                item.classList.add('active');
            }
        });

        document.querySelectorAll('.agent-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${viewName}Section`).classList.add('active');
    }

    async handleLyricsGeneration() {
        const params = {
            theme: document.getElementById('lyricsTheme').value,
            emotion: document.getElementById('lyricsEmotion').value,
            genre: document.getElementById('lyricsGenre').value,
            keywords: document.getElementById('lyricsKeywords').value,
            language: document.getElementById('lyricsLanguage').value
        };

        if (!params.theme) {
            this.showNotification('⚠️ 请输入主题', 'warning');
            return;
        }

        const output = document.getElementById('lyricsOutput');
        output.innerHTML = '<p class="empty-hint">作词智能体创作中...</p>';

        const result = await this.lyricsAgent.generate(params);
        output.textContent = result;

        if (!this.currentWork) this.currentWork = {};
        this.currentWork.lyrics = result;
        this.currentWork.params = params;

        this.showNotification('✅ 歌词生成完成', 'success');
        this.addLog('作词智能体', '歌词生成完成');
    }

    async handleArrangementGeneration() {
        const params = {
            bpm: parseInt(document.getElementById('arrBpm').value),
            key: document.getElementById('arrKey').value,
            lyricsRef: document.getElementById('arrLyricsRef').value,
            emotion: this.currentWork?.params?.emotion || 'happy',
            genre: this.currentWork?.params?.genre || 'pop'
        };

        const output = document.getElementById('arrangementOutput');
        output.innerHTML = '<p class="empty-hint">编曲智能体创作中...</p>';

        const result = await this.arrangementAgent.generate(params);
        output.textContent = result;

        if (!this.currentWork) this.currentWork = {};
        this.currentWork.arrangement = result;

        this.showNotification('✅ 编曲生成完成', 'success');
        this.addLog('编曲智能体', '编曲方案生成完成');
    }

    async handleEvaluation() {
        if (!this.currentWork?.lyrics || !this.currentWork?.arrangement) {
            this.showNotification('⚠️ 请先生成歌词和编曲', 'warning');
            return;
        }

        const output = document.getElementById('evaluationOutput');
        output.innerHTML = '<p class="empty-hint">评估智能体分析中...</p>';

        const result = await this.evaluationAgent.evaluate(
            this.currentWork.lyrics,
            this.currentWork.arrangement
        );

        const report = this.evaluationAgent.formatReport(result);
        output.textContent = report;

        this.currentWork.evaluation = result;

        this.showNotification('✅ 评估完成', 'success');
        this.addLog('评估智能体', `综合评分：${result.total}/10`);
    }

    async handleAudit() {
        if (!this.currentWork?.lyrics || !this.currentWork?.arrangement || !this.currentWork?.evaluation) {
            this.showNotification('⚠️ 请完成前三个步骤', 'warning');
            return;
        }

        const output = document.getElementById('auditOutput');
        output.innerHTML = '<p class="empty-hint">审核智能体检查中...</p>';

        const result = await this.auditAgent.audit(
            this.currentWork.lyrics,
            this.currentWork.arrangement,
            this.currentWork.evaluation
        );

        const report = this.auditAgent.formatAuditReport(result);
        output.textContent = report;

        this.currentWork.audit = result;

        if (result.passed) {
            this.saveToHistory();
            this.showNotification('✅ 审核通过，已保存', 'success');
        } else {
            this.showNotification('⚠️ 审核未通过，需要修改', 'warning');
        }

        this.addLog('审核智能体', result.verdict);
        this.updateWorkflowStatus(result);
    }

    async startFullWorkflow() {
        const params = {
            theme: document.getElementById('wsTheme').value,
            emotion: document.getElementById('wsEmotion').value,
            genre: document.getElementById('wsGenre').value,
            bpm: parseInt(document.getElementById('wsBpm').value),
            key: document.getElementById('wsKey').value,
            keywords: document.getElementById('wsKeywords').value,
            language: 'chinese'
        };

        if (!params.theme) {
            this.showNotification('⚠️ 请输入主题', 'warning');
            return;
        }

        this.currentWork = { params };
        this.updateStepStatus(1, 'running');

        // Step 1: Lyrics
        this.updateStepStatus(2, 'running');
        const lyrics = await this.lyricsAgent.generate(params);
        this.updateStepStatus(2, 'done');
        this.addLog('作词智能体', '歌词生成完成');

        // Step 2: Arrangement
        this.updateStepStatus(3, 'running');
        const arrangement = await this.arrangementAgent.generate({
            bpm: params.bpm,
            key: params.key,
            emotion: params.emotion,
            genre: params.genre
        });
        this.updateStepStatus(3, 'done');
        this.addLog('编曲智能体', '编曲方案生成完成');

        // Step 3: Evaluation
        this.updateStepStatus(4, 'running');
        const evaluation = await this.evaluationAgent.evaluate(lyrics, arrangement);
        this.updateStepStatus(4, 'done');
        this.addLog('评估智能体', `评分：${evaluation.total}/10`);

        // Step 4: Audit
        this.updateStepStatus(5, 'running');
        const audit = await this.auditAgent.audit(lyrics, arrangement, evaluation);
        this.updateStepStatus(5, 'done');
        this.addLog('审核智能体', audit.verdict);

        this.currentWork = {
            ...this.currentWork,
            lyrics,
            arrangement,
            evaluation,
            audit,
            title: document.getElementById('wsTitle').value || params.theme,
            createdAt: new Date().toISOString()
        };

        // Show results
        this.displayResults();
        this.switchView('result');

        if (audit.passed) {
            this.saveToHistory();
            this.showNotification('🎉 创作完成！作品已保存', 'success');
        } else {
            this.showNotification('⚠️ 审核未通过，请查看建议', 'warning');
        }

        this.updateWorkflowStatus(audit);
    }

    updateStepStatus(stepNum, status) {
        const step = document.getElementById(`step${stepNum}`);
        if (step) {
            step.className = `step ${status}`;
            const statusEl = step.querySelector('.step-status');
            const map = {
                pending: '等待中',
                running: '进行中',
                done: '已完成'
            };
            statusEl.className = `step-status status-${status}`;
            statusEl.textContent = map[status];
        }
    }

    updateWorkflowStatus(auditResult) {
        const container = document.getElementById('workflowStatus');
        
        if (auditResult.passed) {
            container.innerHTML = `
                <div class="status-card" style="border-color: var(--success); background: rgba(72, 187, 120, 0.1);">
                    <div class="status-icon">✅</div>
                    <h4>审核通过</h4>
                    <p>作品已成功保存到历史库</p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="status-card" style="border-color: var(--warning); background: rgba(237, 137, 54, 0.1);">
                    <div class="status-icon">⚠️</div>
                    <h4>需要修改</h4>
                    <p>请查看审核报告中的建议</p>
                </div>
            `;
        }
    }

    displayResults() {
        const container = document.getElementById('resultContainer');
        const work = this.currentWork;

        container.innerHTML = `
            <div class="result-section">
                <h3>📝 歌词作品</h3>
                <div class="result-content">${work.lyrics.replace(/\n/g, '<br>')}</div>
            </div>

            <div class="result-section">
                <h3>🎼 编曲方案</h3>
                <div class="result-content">${work.arrangement.replace(/\n/g, '<br>')}</div>
            </div>

            <div class="result-section">
                <h3>📊 评估报告</h3>
                <div class="result-content">${this.evaluationAgent.formatReport(work.evaluation).replace(/\n/g, '<br>')}</div>
            </div>

            <div class="result-section">
                <h3>🛡️ 审核报告</h3>
                <div class="result-content">${this.auditAgent.formatAuditReport(work.audit).replace(/\n/g, '<br>')}</div>
            </div>

            <div style="display: flex; gap: 15px; margin-top: 20px;">
                <button class="btn-primary" onclick="window.app.copyAllResults()">📋 复制全部</button>
                <button class="btn-sm" onclick="window.app.downloadResults()">💾 下载</button>
            </div>
        `;
    }

    saveToHistory() {
        if (!this.currentWork) return;
        
        this.history.unshift(this.currentWork);
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        localStorage.setItem('music_history', JSON.stringify(this.history));
        this.updateHistoryList();
    }

    updateHistoryList() {
        const container = document.getElementById('historyList');
        
        if (this.history.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 40px;">暂无历史作品</p>';
            return;
        }

        container.innerHTML = this.history.map((item, index) => `
            <div class="history-item" onclick="window.app.loadHistoryItem(${index})">
                <div class="history-item-header">
                    <div>
                        <div class="history-title">${item.title || item.params.theme}</div>
                        <div class="history-date">${new Date(item.createdAt).toLocaleString('zh-CN')}</div>
                    </div>
                </div>
                <div class="history-tags">
                    <span class="history-tag">${item.params.emotion}</span>
                    <span class="history-tag">${item.params.genre}</span>
                    <span class="history-tag">${item.audit?.verdict || '未审核'}</span>
                </div>
            </div>
        `).join('');
    }

    loadHistoryItem(index) {
        this.currentWork = this.history[index];
        this.displayResults();
        this.switchView('result');
        this.toggleHistory();
        this.showNotification('✅ 已加载历史作品', 'success');
    }

    toggleHistory() {
        const sidebar = document.getElementById('historySidebar');
        const overlay = document.getElementById('overlay');
        
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    }

    addLog(agent, message) {
        const logContainer = document.getElementById('auditLog');
        const emptyMsg = logContainer.querySelector('.log-empty');
        if (emptyMsg) emptyMsg.remove();

        const time = new Date().toLocaleTimeString('zh-CN');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `
            <span class="log-time">[${time}]</span>
            <strong>${agent}：</strong>${message}
        `;
        
        logContainer.insertBefore(entry, logContainer.firstChild);
    }

    copyToClipboard(elementId) {
        const content = document.getElementById(elementId).textContent;
        navigator.clipboard.writeText(content).then(() => {
            this.showNotification('📋 已复制到剪贴板', 'success');
        });
    }

    copyAllResults() {
        if (!this.currentWork) return;
        
        const allContent = `
${this.currentWork.lyrics}

${this.currentWork.arrangement}

${this.evaluationAgent.formatReport(this.currentWork.evaluation)}

${this.auditAgent.formatAuditReport(this.currentWork.audit)}
        `.trim();

        navigator.clipboard.writeText(allContent).then(() => {
            this.showNotification('📋 全部内容已复制', 'success');
        });
    }

    downloadResults() {
        if (!this.currentWork) return;
        
        const content = `
标题：${this.currentWork.title || this.currentWork.params.theme}
创作时间：${new Date(this.currentWork.createdAt).toLocaleString('zh-CN')}

${this.currentWork.lyrics}

${this.currentWork.arrangement}

${this.evaluationAgent.formatReport(this.currentWork.evaluation)}

${this.auditAgent.formatAuditReport(this.currentWork.audit)}
        `.trim();

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentWork.title || '作品'}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('💾 下载成功', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: '#48bb78',
            error: '#f56565',
            warning: '#ed8936',
            info: '#667eea'
        };
        
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 30px;
            padding: 16px 24px;
            background: ${colors[type]};
            color: white;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-weight: 500;
            font-size: 14px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add animations
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MusicAgentsController();
});
