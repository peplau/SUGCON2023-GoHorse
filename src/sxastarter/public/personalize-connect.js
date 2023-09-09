function GetDatasource(experienceId, experienceValue) {
    debugger;
    if (__personalizeDatasources == null || __personalizeDatasources.length)
        return null;
    var datasource = null;
    for (var i = 0; i < __personalizeDatasources.length; i++) {
        if (__personalizeDatasources[i].ExperienceId == experienceId && __personalizeDatasources[i].ExperienceValue == experienceValue) {
            datasource = __personalizeDatasources[i];
            break;
        }
    }
    return datasource;
}

function PopulateBlock(datasource) {
    debugger;
    var containerId = datasource.container;
    var container = document.querySelector('[cdp-container="' + containerId + '"]');
    if (container == undefined)
        return;

    Object.keys(datasource.fields).forEach(key => {
        var subcontainer = container.querySelector('[cdp-field="' + key + '"]');
        if (subcontainer != undefined) {
            var value = datasource.fields[key];

            if (subcontainer.tagName.toLowerCase() == "img") {
                if (value.src != "")
                    subcontainer.src = value.src;
                if (value.alt != "")
                    subcontainer.alt = value.alt;
            }
            else if (subcontainer.tagName.toLowerCase() == "a") {

                if (value.href != "")
                    subcontainer.href = value.href;
                if (value.target != "")
                    subcontainer.target = value.target;
                if (value.text != "")
                    subcontainer.innerHTML = value.text;
                if (value.title != "")
                    subcontainer.title = value.title;
                if (value.class != "")
                    subcontainer.className = value.class;
            }
            else {
                subcontainer.innerHTML = value;
            }
        }

    });
}