ko.bindingHandlers.jqDraggableResizable = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var obj = valueAccessor();
        var $elem = $(element);

        element.dataObj = obj;

        $elem.resizable({
            stop: function (event, ui) {
                this.dataObj.H(ui.size.height);
                this.dataObj.W(ui.size.width);
            }
        });

        $elem.draggable({
            stop: function (event, ui) {
                this.dataObj.X(ui.position.left);
                this.dataObj.Y(ui.position.top);
            }
        });
    }
};