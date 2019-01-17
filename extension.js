
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

const Lang = imports.lang;
const Gio = imports.gi.Gio;
const ModalDialog = imports.ui.modalDialog;
const Clutter = imports.gi.Clutter;

let text, button;

const MyAboutDialog = new Lang.Class({
    Name: 'MyAboutDialog',
    Extends: ModalDialog.ModalDialog,

    _init: function() {
        this.parent({ styleClass: 'extension-dialog' });

        this.setButtons([{ label: "OK",
                           action: Lang.bind(this, this._onClose),
                           key:    Clutter.Escape
                         }]);

        let box = new St.BoxLayout({ vertical: true});
        this.contentLayout.add(box);

        //let gicon = new Gio.FileIcon({ file: Gio.file_new_for_path(MySelf.path + "/icons/icon.png") });
        //let icon = new St.Icon({ gicon: gicon });
        //box.add(icon);

        //box.add(new St.Label({ text: "AboutDialogTest Version " + MySelf.metadata.version, x_align: Clutter.ActorAlign.CENTER, style_class: "title-label" }));
        box.add(new St.Label({ text: "GNOME Shell extension to display an About Dialog.", x_align: Clutter.ActorAlign.CENTER }));
        box.add(new St.Label({ text: "This program comes with absolutely no warranty.", x_align: Clutter.ActorAlign.CENTER, style_class: "warn-label" }));
        box.add(new St.Label({ text: "Copyright © 2017-2018 BlahBlahBlah", x_align: Clutter.ActorAlign.CENTER, style_class: "copyright-label" }));
        box.add(new St.Button({ label: "BlahBlahBlah", style_class: "custom-button" }));
    },

    _onClose: function(button, event) {
        this.close(global.get_current_time());
    },
});

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _showHello() {
    if (!text) {
        text = new St.Label({ style_class: 'helloworld-label', text: "Hello, world!" });
        Main.uiGroup.add_actor(text);
    }

    log(text);
    text.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    text.set_position(monitor.x + Math.floor(monitor.width / 2 - text.width / 2),
                      monitor.y + Math.floor(monitor.height / 2 - text.height / 2));

    Tweener.addTween(text,
                     { opacity: 0,
                       time: 2,
                       transition: 'easeOutQuad',
                       onComplete: _hideHello });
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
    button.connect('button-press-event', _showHello);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
