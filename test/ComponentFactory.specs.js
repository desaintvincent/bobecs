import ComponentFactory from './../src/ComponentFactory';
const chai      = require('chai');
const sinon     = require('sinon');
const sinonChai = require('sinon-chai');
const expect    = chai.expect;

chai.use(sinonChai);

class Foo {
    constructor() {
        this._props = 'bar';
    }
}

class Bar {
    constructor() {
        this._props = 'bar';
    }
}

describe('ComponentFactory', () => {
    describe('static', () => {
        it('should have a _components property', () => {
            expect(ComponentFactory).to.have.a.property('_components');
        });
    });

    describe('add', () => {
        it('should store an instance of a class', () => {
            ComponentFactory.add(Foo);
            ComponentFactory.add(Bar);
            expect(ComponentFactory._components).to.have.a.property('foo');
            expect(ComponentFactory._components).to.have.a.property('bar');
        });
    });

    describe('create', () => {
        it('should create an instance of stored class', () => {
            const foo = ComponentFactory.create('foo');
            const bar = ComponentFactory.create('bar');
            expect(foo).to.be.an.instanceof(Foo);
            expect(bar).to.be.an.instanceof(Bar);
        });

        it('should throw an error if a non declared object is called', () => {
            expect(() => { ComponentFactory.create('foo'); }).to.not.throw();
            expect(() => { ComponentFactory.create('woof'); }).to.throw('"woof" is not declared in the ComponentFactory');
        });
    });
});
