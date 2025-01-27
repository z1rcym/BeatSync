(function() {
    var dialog = new Window("dialog", "BeatSync");
    dialog.orientation = "column";
    
    var bpmGroup = dialog.add("group");
    bpmGroup.add("statictext", undefined, "BPM:");
    var bpmInput = bpmGroup.add("edittext", undefined, "120");
    bpmInput.size = [100, 25];

    var downbeatCheck = dialog.add("checkbox", undefined, "Include downbeat");
    downbeatCheck.value = true;

    var buttonGroup = dialog.add("group");
    buttonGroup.add("button", undefined, "OK");

    if (dialog.show() !== 2) {
        var bpm = parseFloat(bpmInput.text);
        var includeDownbeat = downbeatCheck.value;
        
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Activate the composition");
            return;
        }

        var beatInterval = 60 / bpm;
        
        var nullLayer = comp.layers.addNull();
        nullLayer.name = "BPM Marker (" + bpm + " BPM)";
        
        var currentTime = includeDownbeat ? -beatInterval : 0;
        var beatCount = 0;

        while (currentTime <= comp.duration) {
            if (includeDownbeat || beatCount > 0) {
                var marker = new MarkerValue("");
                marker.comment = beatCount;
                marker.duration = 0;
                nullLayer.property("Marker").setValueAtTime(currentTime, marker);
            }
            
            beatCount++;
            currentTime += beatInterval;
        }
    }
})();