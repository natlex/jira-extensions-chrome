(function() {
    function init() {
        const issueLinkElements = document.querySelectorAll(".aui-page-header-main a.issue-link");
        const issueTitleElement = document.querySelector("h1#summary-val");
        const issueType = document.querySelector("#type-val").innerText.trim();
		const issueFixVersion = document.querySelector("#fixfor-val").innerText.trim();
		const issuePriority = document.querySelector("#priority-val").innerText.trim();
		let dropdownOpen = false;
        
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
        
        function createDropdownOption(id, innertext, clickFn) {
            let dropdownElement = document.createElement("span");
            dropdownElement.style.cursor = "pointer";
            dropdownElement.style.marginLeft = "10px";
			dropdownElement.style.border = "thin solid #000000";
			dropdownElement.style.borderRadius = "25px";
			dropdownElement.style.padding = "5px 5px 5px 5px"; 
			dropdownElement.innerText = innertext;
			dropdownElement.id = id;
            dropdownElement.onclick = clickFn;
            return dropdownElement;
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
			if(issueType == "Bug" && (issuePriority == "Critical" || issuePriority == "Blocker")) {
				if(issueFixVersion != "None"){
					const issueTypeGitName = `hotfix/${issueGitName}`;
					navigator.clipboard.writeText(issueTypeGitName);
				}
				else{
					const issueTypeGitName = `bugfix/${issueGitName}`;
					navigator.clipboard.writeText(issueTypeGitName);
				}
			}
			else {
				const issueTypeGitName = `feature/${issueGitName}`;
				navigator.clipboard.writeText(issueTypeGitName);
			}
        }));
        
   		containerElement.appendChild(createClipboardButton("aui-iconfont-arrow-down-small", "Dropdown to choose prefix for the branch", function() {
			if(!dropdownOpen){
			dropdownOpen = true;
			this.classList.replace("aui-iconfont-arrow-down-small","aui-iconfont-chevron-left");
			const issueGitName = (replaceBadSymbols(issueDescription)).split(' ').join('-');
			containerElement.appendChild(createDropdownOption("bugfixButton", "bugfix", function() {
				let issueTypeGitName = `bugfix/${issueGitName}`;
				navigator.clipboard.writeText(issueTypeGitName);
			}));
			containerElement.appendChild(createDropdownOption("hotfixButton", "hotfix", function() {
				let issueTypeGitName = `hotfix/${issueGitName}`;
				navigator.clipboard.writeText(issueTypeGitName);
			}));
			containerElement.appendChild(createDropdownOption("featureButton", "feature", function() {
				let issueTypeGitName = `feature/${issueGitName}`;
				navigator.clipboard.writeText(issueTypeGitName);
			}));
			}
			else{
				dropdownOpen = false;
				containerElement.removeChild(containerElement.childNodes[4]);
				containerElement.removeChild(containerElement.childNodes[4]);
				containerElement.removeChild(containerElement.childNodes[4]);
				this.classList.replace("aui-iconfont-chevron-left","aui-iconfont-arrow-down-small");
			}
        }));
    }

    chrome.storage.sync.get(["urlPattern"], function(data) {
        const urlPattern = data && data.urlPattern || "https://jira.*";
        const url = window.location.href;

        if (url.match(urlPattern)) {
            init();
        }
    });
})();
