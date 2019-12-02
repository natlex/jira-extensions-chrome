(function() {
    const issueLinkElements = document.querySelectorAll(".aui-page-header-main a.issue-link");
    const issueTitleElement = document.querySelector("h1#summary-val");
    if (!issueLinkElements || !issueLinkElements.length || !issueTitleElement) return;
	
	const umlautMap = {
        '\u00dc': 'UE',
        '\u00c4': 'AE',
        '\u00d6': 'OE',
        '\u00fc': 'ue',
        '\u00e4': 'ae',
        '\u00f6': 'oe',
        '\u00df': 'ss',
    }
	
	function replaceUmlaute(str) {
        return str
            .replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, (a) => {
                var big = umlautMap[a.slice(0, 1)];
                return big.charAt(0) + big.charAt(1).toLowerCase() + a.slice(1);
            })
            .replace(new RegExp('['+Object.keys(umlautMap).join('|')+']',"g"),
                (a) => umlautMap[a]
            );
    }

    function replaceBadSymbols(str) {
        return str.replace(/[^\w_\.\(\)\s]+/g, ' ');
    }

    function createClipboardButton(iconClass, title, clickFn) {
        let buttonElement = document.createElement("span");
        buttonElement.classList.add("icon", "aui-icon", "aui-icon-small", iconClass);
        buttonElement.title = title;
        buttonElement.style.cursor = "pointer";
        buttonElement.style.marginLeft = "10px";
        buttonElement.onclick = clickFn;
        return buttonElement;
    }

    const issueLinkElement = issueLinkElements[issueLinkElements.length - 1];
    const issueTitle = replaceUmlaute(issueTitleElement.innerText);
    const issueDescription = `${issueLinkElement.innerText} ${issueTitle}`;

    const containerElement = issueLinkElement && issueLinkElement.parentElement;
    if (!containerElement) return;
    
    containerElement.appendChild(createClipboardButton("aui-iconfont-copy", "Copy issue fullname to clipboard", function() {
        navigator.clipboard.writeText(issueDescription);
    }));

    containerElement.appendChild(createClipboardButton("aui-iconfont-branch", "Copy branch name to clipboard", function() {
        const issueGitName = (replaceBadSymbols(issueDescription)).split(' ').join('-');
        navigator.clipboard.writeText(issueGitName);
    }));
})();