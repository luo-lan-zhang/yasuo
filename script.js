const quizPage = document.getElementById('quizPage');
const resultPage = document.getElementById('resultPage');
const submit = document.getElementById('submit');
const reset = document.getElementById('reset');

submit.addEventListener('click', () => {
  const q1 = document.querySelector('input[name="q1"]:checked');
  const q2 = document.querySelector('input[name="q2"]:checked');
  const q3 = document.querySelector('input[name="q3"]:checked');
  const q4 = document.querySelector('input[name="q4"]:checked');
  const q5 = document.querySelector('input[name="q5"]:checked');

  if (!q1 || !q2 || !q3 || !q4 || !q5) {
    alert('请完成所有题目哦～');
    return;
  }

  let score = [q1, q2, q3, q4, q5].reduce((s, v) => s + parseInt(v.value), 0);
  let type, tag, desc;

  if (score <= 6) {
    type = "甜美直球小宝贝";
    tag = "热情主动";
    desc = "你在恋爱里超级勇敢，喜欢就会大胆表达，像小太阳一样温暖对方。和你谈恋爱每天都甜甜的，超有安全感！";
  } else if (score <= 9) {
    type = "温柔治愈小仙女";
    tag = "体贴细腻";
    desc = "你特别懂照顾别人情绪，温柔又包容，和你在一起会特别安心舒服，是让人离不开的治愈系恋人。";
  } else {
    type = "清醒独立小大人";
    tag = "成熟稳重";
    desc = "你在恋爱里很理智，不粘人、不迷失，有自己的世界。你擅长沟通和成长，是最靠谱、最长久的伴侣。";
  }

  document.getElementById('type').innerText = type;
  document.getElementById('tag').innerText = tag;
  document.getElementById('analysis').innerText = desc;

  quizPage.style.display = 'none';
  resultPage.style.display = 'block';
});

reset.addEventListener('click', () => {
  document.querySelectorAll('input[type="radio"]').forEach(i => i.checked = false);
  resultPage.style.display = 'none';
  quizPage.style.display = 'block';
});