Ext.define('Memo.controller.Memo', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
          main: 'main'

        },
        control: {
          'button[action=add]': {
            tap: 'onAddButtonTap'
          }
        }
    },

    //called when the Application is launched, remove if not needed
    launch: function(app) {

    },

    onAddButtonTap: function(){
      this.getMain().push({
        xtype: 'memoform'
      });
    }
});
