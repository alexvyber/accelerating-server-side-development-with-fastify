app.addHook("onRoute", function inspector(routeOptions) {
  console.log(routeOptions)
})

app.addHook("onRegister", function inspector(plugin, pluginOptions) {
  console.log("Chapter 2, Plugin System and Boot Process")
})

app.addHook("onReady", function preLoading(done) {
  console.log("onReady")
  done()
})

app.addHook("onClose", function manageClose(done) {
  console.log("onClose")
  done()
})

app.addHook("onReady", async function preLoading() {
  console.log("async onReady") // the done argument is gone!
})
