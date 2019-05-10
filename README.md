# Virtual-DOM

This is a simplified version of [Matt-Esch/virtual-dom](https://github.com/kawhi66/Virtual-DOM-forked). I lost the implementation of thunk and widget, just keep the nuclear vnode and vtext. I am not trying to write a new Virtual-DOM here, I just wanna figure out how does they work.

# Documents

The documents in `./docs` help to understand:

-   [VNode](./docs/vnode.md) - A representation of a DOM element
-   [VText](./docs/vtext.md) - A representation of a text node
-   [Hooks](./docs/hooks.md) - The mechanism for executing functions after a new node has been created

# Usage

Run `git clone git@github.com:kawhi66/Virtual-DOM.git` to clone this repository.

Run `cd Virtual-DOM` to move into the repository.

Run `yarn --registry=http://registry.npm.taobao.org` to install dependencies.

Run `yarn test` to use jest to do the test.

# Example

There is a fun example in [Matt-Esch/virtual-dom](https://github.com/kawhi66/Virtual-DOM-forked), and it works fine here too.

![](/example/assets/a-fun-example.png)

I also made another example, it list some solutions to move an inner element to the centre of parent element.

![](/example/assets/another-example.png)
