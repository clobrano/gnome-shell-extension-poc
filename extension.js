
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

const Lang = imports.lang;
const Gio = imports.gi.Gio;
const ModalDialog = imports.ui.modalDialog;
const Clutter = imports.gi.Clutter;
const Gtk = imports.gi.Gtk;

let text, button;

const MyAboutDialog = new Lang.Class({
    Name: 'MyAboutDialog',
    Extends: ModalDialog.ModalDialog,

    _init: function() {
        let rgba = this._get_button_color();

        log(rgba.green);
        this.parent({ styleClass: 'extension-dialog' });

        this.setButtons([{ label: "OK",
                           action: Lang.bind(this, this._onClose),
                           key:    Clutter.Escape
                         }]);

        let box = new St.BoxLayout({ vertical: true});
        this.contentLayout.add(box);

        box.add(new St.Label({ text: "GNOME Shell extension to Play with theming.", x_align: Clutter.ActorAlign.CENTER }));
        box.add(new St.Label({ text: "This program comes with absolutely no warranty.", x_align: Clutter.ActorAlign.CENTER, style_class: "warn-label" }));
        box.add(new St.Button({ label: "OK", style_class: "custom-button" }));
    },

    _get_button_color: function() {
        let button = new Gtk.WidgetPath();
        button.append_type(Gtk.Button);

        let context = new Gtk.StyleContext();
        context.set_path(button);
        context.add_class('custom-button');

        return context.get_background_color(Gtk.StateFlags.PRELIGHT);
    },

    _onClose: function(button, event) {
        this.close(global.get_current_time());
    },
});

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _showDialog() {
    let dialog = new MyAboutDialog();
    dialog.open(global.get_current_time());
}

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    let icon = new St.Icon({ icon_name: 'system-run-symbolic',
                             style_class: 'system-status-icon' });

    button.set_child(icon);
    button.connect('button-press-event', _showDialog);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
