CodeMirror.defineMode("freemarker", function(config, parserConfig) {
  
  // Inner mode
  var htmlMixedMode;
  
  //tokenizer when in html mode
  function htmlDispatch(stream, state) {
      if (stream.match(/^<\/?[#@]/, false)) {
          state.token=freemarkerDispatch;
          stream.next();
          return "fm-tag";
      } else {
          return htmlMixedMode.token(stream, state.htmlState);
      }
    }

  //tokenizer when in scripting mode
  function freemarkerDispatch(stream, state) {
      if (stream.match(/^\/?>/, true))  {
          state.token=htmlDispatch;
          return "fm-tag";
      } else {
          stream.next();
          return "fm-tag";
      } 
  }

  return {
    startState: function() {
      htmlMixedMode = htmlMixedMode || CodeMirror.getMode(config, "htmlmixed");
      return { 
          token :  htmlDispatch,
          htmlState : htmlMixedMode.startState(),
          freemarkerState : ""
      }
    },

    token: function(stream, state) {
      return state.token(stream, state);
    },

    indent: function(state, textAfter) {
      return htmlMixedMode.indent(state.htmlState, textAfter);
    },
    /* 
    copyState: function(state) {
      return {
       token : state.token,
       htmlState : CodeMirror.copyState(htmlMixedMode, state.htmlState),
       scriptState : CodeMirror.copyState(scriptingMode, state.scriptState)
       }
    },
    */
    
  }
});

CodeMirror.defineMIME("application/x-freemarker", "freemarker");
