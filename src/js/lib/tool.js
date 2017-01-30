function createElement(type) {
    return document.createElement(type);
}

function newElement(type, class_, $contain, Content, attobj) {
    let $el = document.createElement(type);
    if (class_) {
        $el.classList.add(class_);
    }
    if (typeof(Content) != "undefined") {
        if ((typeof Content === "string") || (typeof Content === "number")) {
            $el.innerHTML = Content;
        } else if (Content.nodeType) {
            $contain.appendChild($el);
        } else {
            throw "Content Param type error";
        }
    }
    if (attobj) {
        for (let att in attobj) {
            $el.setAttribute(att, attobj[att]);
        }
    }
    $contain.appendChild($el);
    return $el;
}

export {createElement, newElement};