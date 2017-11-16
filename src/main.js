import wasm from './main.rs'

wasm.initialize({noExitRuntime: true}).then(module => {
  const operations = {
    add: module.cwrap('add', 'number', ['number', 'number']),
    subtract: module.cwrap('subtract', 'number', ['number', 'number'])
  }
  function randomOperation (operations) {
    return Object.keys(operations)[Math.floor(Math.random() * Object.keys(operations).length)]
  }
  function randomInt (start, end) {
    return Math.floor(Math.random() * end) + start
  }
  function perform (operation, a, b) {
    let output = `${operation}(${a}, ${b}) => ${operations[operation](a, b)}`
    let li = document.createElement('li')
    let text = document.createTextNode(output)
    li.appendChild(text)
    document.querySelector('.output')
      .appendChild(li)
    console.log(output)
  }
  for (let i = 0; i < 10; i++) {
    let operation = randomOperation(operations)
    let a = randomInt(0, 255)
    let b = randomInt(0, 255)
    perform(operation, a, b)
  }
})
