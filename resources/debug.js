function nodeAndOffsetAsString(node, offset) {
    var nodeText = node.nodeValue;
    var result = node;
    if (node.nodeType == 3)
        result += " " + nodeText.substring(0, offset) + "<span class=\"mark\">|</span>" + nodeText.substring(offset);
    else
        result += " offset: " + offset;

    var id = " (id: " + node.id + ")";
    if (node.nodeType == 3)
        id = " (parent id: " + node.parentNode.id + ")";

    return id + ": " + result;
}

function selectionAsString(sel)
{
    return "* anchor" + nodeAndOffsetAsString(sel['anchorNode'], sel['anchorOffset']) + "<br>" +
        "* focus" + nodeAndOffsetAsString(sel['focusNode'], sel['focusOffset']) + "<br>" +
        "* isCollapsed: " + sel['isCollapsed'] + "<br>";
}

function getSelectedText()
{
    var container = document.getElementById("selected-text");
    container.innerHTML = "";

    var sel = window.getSelection();
    container.innerHTML += "<strong>Selection properties:</strong><br>";
    container.innerHTML += selectionAsString(sel) + "<br>";

    if (sel.rangeCount)
    {
        // Show range properties
        container.innerHTML += "<strong>Selection content:</strong><br>";
        var selectionRange = sel.getRangeAt(0);
        container.innerHTML += selectionRange.toString();
    }
}

function select(fromId, toId) {
    var sel = window.getSelection();

    var extent = document.getElementById(toId);
    sel.collapse(document.getElementById(fromId), 0);
    sel.extend(document.getElementById(toId), 0);
}

function showHideTests(id) {
    var style = document.getElementById(id).style;
    style.display = (!style.display || style.display == "none") ? "block" : "none";
}

document.onmouseup = getSelectedText;

var counter = window.location.search.replace("?", "");
if (!counter)
    counter = 100;

var values = new Array();

function selectText(repeat) {
    var selection = window.getSelection();

    var summary = document.getElementById("summary");
    var average = document.getElementById("average");

    // Reset selection
    selection.collapse(summary, 0);
    selection.extend(summary, 0);

    selection.collapse(document.getElementById("word0"), 0);

    setTimeout(function() {
        var start = new Date().getTime();

        for (var i = 1; i < counter; i++)
            selection.extend(document.getElementById("word" + i), 0);

        var end = new Date().getTime();

        var time = end - start;

        values.push(time);

        var tr = document.createElement("tr");
        tr.innerHTML = "<th>Time<sup>" + values.length + "</sup></th><td class=\"time\">" + time + " ms</td>";
        summary.appendChild(tr);

        var sum = values.reduce(function(previousValue, currentValue) { return previousValue + currentValue; });
        average.innerHTML = Math.round(sum / values.length) + " ms";

        if (repeat > 1)
            selectText(repeat - 1);
    }, 500);
}

function fillDescriptionOnlyRegions() {
    var lastWord = document.getElementById("lastWord");
    lastWord.innerHTML = "word" + (counter - 1);

    var regionsCounter = document.getElementById("regionsCounter");
    regionsCounter.innerHTML = counter;
}

function fillDescription() {
    var lastWord = document.getElementById("lastWord");
    lastWord.innerHTML = "word" + (counter - 1);

    var regularDivsCounter = document.getElementById("regularDivsCounter");
    regularDivsCounter.innerHTML = counter / 2;
    var regionsCounter = document.getElementById("regionsCounter");
    regionsCounter.innerHTML = counter / 2;
}

function fillDescriptionNoRegions() {
    var lastWord = document.getElementById("lastWord");
    lastWord.innerHTML = "word" + (counter - 1);

    var regularDivsCounter = document.getElementById("regularDivsCounter");
    regularDivsCounter.innerHTML = counter;
}

function createOnlyRegionsDocument() {
    var body = document.body;

    for (var i = 0; i < counter; i ++) {
        var inDiv = document.createElement("div");
        inDiv.className = "region";

        body.appendChild(inDiv);
    }

    var source = document.createElement("div");
    source.id = "source";

    for (var i = 0; i < counter; i++) {
        var word = document.createElement("span");
        word.id = "word" + i;
        word.className = "token";
        word.innerHTML = "word" + i;

        var breakDiv = document.createElement("div");
        breakDiv.className = "break";

        source.appendChild(document.createTextNode("inside region inside region inside region inside region inside region inside region inside region inside region inside region inside region "));
        source.appendChild(word);
        source.appendChild(document.createTextNode(" inside region inside region inside region inside region inside region inside region inside region inside region inside region inside region"));
        source.appendChild(breakDiv);
    }

    body.appendChild(source);
}

function createRegionsDocument() {
    var body = document.body;

    for (var i = 0; i < counter; i += 2) {
        var outDiv = document.createElement("div");
        outDiv.className = "outside-region";

        var word = document.createElement("span");
        word.id = "word" + i;
        word.className = "token";
        word.innerHTML = "word" + i;

        outDiv.appendChild(document.createTextNode("outside region outside region outside region outside region outside region outside region outside region outside region outside region "));
        outDiv.appendChild(word);
        outDiv.appendChild(document.createTextNode(" outside region outside region outside region outside region outside region outside region outside region outside region outside region"));

        var inDiv = document.createElement("div");
        inDiv.className = "region";

        body.appendChild(outDiv);
        body.appendChild(inDiv);
    }

    var source = document.createElement("div");
    source.id = "source";

    for (var i = 1; i < counter; i += 2) {
        var word = document.createElement("span");
        word.id = "word" + i;
        word.className = "token";
        word.innerHTML = "word" + i;

        var breakDiv = document.createElement("div");
        breakDiv.className = "break";

        source.appendChild(document.createTextNode("inside region inside region inside region inside region inside region inside region inside region inside region inside region inside region "));
        source.appendChild(word);
        source.appendChild(document.createTextNode(" inside region inside region inside region inside region inside region inside region inside region inside region inside region inside region"));
        source.appendChild(breakDiv);
    }

    body.appendChild(source);
}

function createNoRegionsDocument() {
    var body = document.body;

    for (var i = 0; i < counter; i += 2) {
        var outDiv = document.createElement("div");
        outDiv.className = "outside-region";

        var word1 = document.createElement("span");
        word1.id = "word" + i;
        word1.className = "token";
        word1.innerHTML = "word" + i;

        outDiv.appendChild(document.createTextNode("outside region outside region outside region outside region outside region outside region outside region outside region outside region "));
        outDiv.appendChild(word1);
        outDiv.appendChild(document.createTextNode(" outside region outside region outside region outside region outside region outside region outside region outside region outside region"));

        var inDiv = document.createElement("div");
        inDiv.className = "region";

        var word2 = document.createElement("span");
        word2.id = "word" + (i + 1);
        word2.className = "token";
        word2.innerHTML = "word" + (i + 1);

        inDiv.appendChild(document.createTextNode("inside region inside region inside region inside region inside region inside region inside region inside region inside region inside region "));
        inDiv.appendChild(word2);
        inDiv.appendChild(document.createTextNode(" inside region inside region inside region inside region inside region inside region inside region inside region inside region inside region"));

        body.appendChild(outDiv);
        body.appendChild(inDiv);
    }
}

function createOnlyRegions2FlowThreadsDocument() {
    var body = document.body;

    for (var i = 0; i < counter; i += 2) {
        var inDiv1 = document.createElement("div");
        inDiv1.id = "region-1";
        inDiv1.className = "region";

        var inDiv2 = document.createElement("div");
        inDiv2.id = "region-2";
        inDiv2.className = "region";

        body.appendChild(inDiv1);
        body.appendChild(inDiv2);
    }

    var source1 = document.createElement("div");
    source1.id = "source-1";

    var source2 = document.createElement("div");
    source2.id = "source-2";

    for (var i = 0; i < counter; i += 2) {
        var word1 = document.createElement("span");
        word1.id = "word" + i;
        word1.className = "token";
        word1.innerHTML = "word" + i;

        var breakDiv1 = document.createElement("div");
        breakDiv1.className = "break";

        source1.appendChild(document.createTextNode("inside region inside region inside region inside region inside region inside region inside region inside region inside region inside region "));
        source1.appendChild(word1);
        source1.appendChild(document.createTextNode(" inside region inside region inside region inside region inside region inside region inside region inside region inside region inside region"));
        source1.appendChild(breakDiv1);

        var word2 = document.createElement("span");
        word2.id = "word" + (i + 1);
        word2.className = "token";
        word2.innerHTML = "word" + (i + 1);

        var breakDiv2 = document.createElement("div");
        breakDiv2.className = "break";

        source2.appendChild(document.createTextNode("inside region inside region inside region inside region inside region inside region inside region inside region inside region inside region "));
        source2.appendChild(word2);
        source2.appendChild(document.createTextNode(" inside region inside region inside region inside region inside region inside region inside region inside region inside region inside region"));
        source2.appendChild(breakDiv2);
    }

    body.appendChild(source1);
    body.appendChild(source2);
}
