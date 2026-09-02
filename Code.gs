var CLAUDE_API_KEY = "여기에_본인의_Claude_API_키를_붙여넣으세요";
var DAILY_ASK_LIMIT = 200;

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (data.action === 'ask') {
      if (!checkAndIncrementAskCount()) {
        return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: 'daily limit reached' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      return handleAsk(data);
    } else {
      return handleApply(data);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function checkAndIncrementAskCount() {
  var props = PropertiesService.getScriptProperties();
  var today = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd');
  var key = 'askCount_' + today;
  var count = parseInt(props.getProperty(key) || '0', 10);

  if (count >= DAILY_ASK_LIMIT) {
    return false;
  }

  props.setProperty(key, String(count + 1));
  return true;
}

function handleApply(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    new Date(),
    data.name,
    data.phone,
    data.interests,
    data.email,
    data.ageGroup,
    data.timeSlot,
    data.source
  ]);
  return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleAsk(data) {
  var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    payload: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 1000,
      system: '당신은 모두의 AI평생교육원의 AI 도우미입니다. 40~70대 어르신 눈높이에 맞춰, 일상적인 비유를 사용해서, 존댓말로, 짧고 친절하게 설명하세요. 전문 용어가 나오면 반드시 쉬운 말로 풀어주세요. 답변은 4문장을 넘기지 마세요.',
      messages: [{ role: 'user', content: data.question }]
    }),
    muteHttpExceptions: true
  });

  var result = JSON.parse(response.getContentText());
  var textBlocks = (result.content || [])
    .filter(function(b){ return b.type === 'text'; })
    .map(function(b){ return b.text; })
    .join('\n');

  if (!textBlocks) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', message: 'empty answer' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ result: 'success', answer: textBlocks }))
    .setMimeType(ContentService.MimeType.JSON);
}
