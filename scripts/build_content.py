"""PDF 추출본(content-src/2051-extracted.json) → 작품별 콘텐츠 JSON(src/content/*.json).

본문 글자는 손대지 않고 블록 단위로만 나눈다. 교정이 필요하면 생성된 JSON을 직접 고치면 된다.
(이 스크립트를 다시 돌리면 src/content/*.json 의 수동 교정이 덮어써지니 주의)
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
items = json.loads((ROOT / 'content-src/2051-extracted.json').read_text())

SPEAKER = re.compile(r'^(서윤|정호|미영|민우|도현)\s*:\s*(.*)$', re.S)
FN_MARK = re.compile(r'[¹²³⁴⁵⁶⁷⁸⁹]')


def find(genre, kind):
    return next(x for x in items if x['부문'] == genre and x['구분'] == kind)


def paras(text):
    return [p for p in text.split('\n\n') if p.strip()]


def extras(genre):
    s, r = find(genre, '수상소감'), find(genre, '심사평')
    return {
        'speech': {'title': s['제목'], 'author': s['필자'], 'paragraphs': paras(s['본문'])},
        'review': {'title': r['제목'], 'judge': r['필자'], 'affiliation': r['소속'],
                   'paragraphs': paras(r['본문'])},
    }


def base(id_, genre, label, w):
    return {'id': id_, 'genre': genre, 'label': label, 'title': w['제목'],
            'author': w['필자'], 'affiliation': w['소속'], 'issue': '2051호',
            'date': '2026-11-02'}


def poem():
    w = find('시', '당선작')
    stanzas = [s.split('\n') for s in w['본문'].split('\n\n')]
    blocks = [{'t': 'stanza', 'lines': s} for s in stanzas]
    return {**base('poem', '시', '시 부문 당선작', w), 'blocks': blocks, **extras('시')}


def novel():
    w = find('소설', '당선작')
    blocks = [{'t': 'break'} if p.strip() == '*' else {'t': 'p', 'text': p} for p in paras(w['본문'])]
    return {**base('novel', '소설', '소설 부문 당선작', w), 'blocks': blocks, **extras('소설')}


def play():
    w = find('희곡', '당선작')
    ps = paras(w['본문'])
    cast_txt = ps.pop(0)
    cast = []
    for line in cast_txt.split('\n')[1:]:
        m = re.match(r'^(\S+)\((\d+)\):\s*(.*)$', line)
        cast.append({'name': m[1], 'age': int(m[2]), 'desc': m[3]})
    blocks = []
    for p in ps:
        if p == '무대':
            blocks.append({'t': 'scene', 'text': p})
        elif re.match(r'^제\d막', p):
            blocks.append({'t': 'scene', 'text': p})
        elif m := SPEAKER.match(p):
            line = {'t': 'line', 'speaker': m[1], 'text': m[2]}
            # 인용으로 끝나는 대사 뒤에 붙어 버린 지문은 따로 떼어 둔다(번호는 그대로)
            if sm := re.match(r"^(.*['.!?…])(\([^()]*\))$", m[2], re.S):
                line['text'], line['dir'] = sm[1], sm[2]
            blocks.append(line)
        elif p.startswith('('):
            blocks.append({'t': 'dir', 'text': p})
        elif p == '막.':
            blocks.append({'t': 'end', 'text': p})
        else:
            blocks.append({'t': 'stage', 'text': p})
    return {**base('play', '희곡', '희곡 부문 당선작 · 창작희곡 2막', w), 'cast': cast,
            'blocks': blocks, **extras('희곡')}


def critique():
    w = find('문예평론', '당선작')
    body, notes = w['본문'].split('\n\n[각주]\n')
    footnotes = []
    for line in notes.split('\n'):
        m = re.match(r'^(\d)\s+(.*)$', line)
        footnotes.append({'n': int(m[1]), 'text': m[2]})
    blocks, in_quote = [], False
    for p in paras(body):
        if re.match(r'^\d\.\s', p):
            blocks.append({'t': 'h', 'text': p})
            continue
        # 본문 속 하쿠의 독백 인용(지면에서 이탤릭 블록)
        if p.startswith('어떤 이름을 적어야 할까'):
            in_quote = True
        blocks.append({'t': 'quote' if in_quote else 'p', 'text': p})
        if in_quote and p.endswith('(35쪽)'):
            in_quote = False
    return {**base('critique', '문예평론', '문예평론 부문 당선작', w), 'blocks': blocks,
            'footnotes': footnotes, **extras('문예평론')}


for fn in (poem, novel, play, critique):
    data = fn()
    for i, b in enumerate(data['blocks']):
        b['i'] = i
    out = ROOT / 'src/content' / f"{data['id']}.json"
    out.write_text(json.dumps(data, ensure_ascii=False, indent=1))
    print(out.name, len(data['blocks']), 'blocks')
