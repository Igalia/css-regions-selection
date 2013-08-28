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

function selectionExample() {
    var sel = window.getSelection();

    var base = document.getElementById("word2");
    var extent = document.getElementById("word5");
    sel.setBaseAndExtent(base, 0, extent, 0);

    getSelectedText();
}

document.onmouseup = getSelectedText;
window.onload = selectionExample;
