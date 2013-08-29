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

    var base = document.getElementById(fromId);
    var extent = document.getElementById(toId);
    sel.setBaseAndExtent(base, 0, extent, 0);
}

document.onmouseup = getSelectedText;

function showHideTests(id) {
    var style = document.getElementById(id).style;
    style.display = (!style.display || style.display == "none") ? "block" : "none";
}
