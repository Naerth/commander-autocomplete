#!/usr/bin/env node
import { program, useAutocompletion } from "../src";

program.name("continew")

const hello = program.command("hello")

hello.command("world").action(() => {
    console.log("Hello world!")
})


await useAutocompletion(program);


program.parse();