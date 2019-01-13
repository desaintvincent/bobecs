const Component = require('../src/Component');
const { expect } = require('chai');
describe('Component', () => {
    describe('constructor', () => {
        it('should init _dirty var to true', () => {
            const c = new Component();
            expect(c._dirty).to.equal(true);
        });
    });

    describe('setDirty', () => {
        it('should set the component dirty', () => {
            const c = new Component();
            expect(c._dirty).to.equal(true);
            c.setDirty(false);
            expect(c._dirty).to.equal(false);
            c.setDirty(true);
            expect(c._dirty).to.equal(true);
        });
    });

    describe('isDirty', () => {
        it('should return if the component is dirty', () => {
            const c = new Component();
            expect(c.isDirty()).to.equal(true);
            c.setDirty(false);
            expect(c.isDirty()).to.equal(false);
        });
    });

    describe('serialize', () => {
        it('should return an object with all props exept _isDirty', () => {
            const c = new Component();
            c._foo = 1;
            c._bar = 2;
            c._hello = false;
            const s = c.serialize();
            expect(s).to.deep.equal({_foo: 1, _bar: 2, _hello: false});
        });
    });

    describe('build', () => {
        it('should build a component with all props in arg', () => {
            const c = new Component();
            c.build({_foo: 1, _bar: 2, _hello: false});
            expect(c).to.have.a.property('_foo');
            expect(c).to.have.a.property('_bar');
            expect(c).to.have.a.property('_hello');
            expect(c._foo).to.equal(1);
            expect(c._bar).to.equal(2);
            expect(c._hello).to.equal(false);
        });
    });

    describe('clone', () => {
        it('should clone a component and copy all props exept _isDirty', () => {
            const c = new Component();
            c._foo = 1;
            c._bar = 2;
            c._hello = false;
            c.setDirty(false);

            const c2 = c.clone();
            expect(c2).to.have.a.property('_foo');
            expect(c2).to.have.a.property('_bar');
            expect(c2).to.have.a.property('_hello');
            expect(c2).to.have.a.property('_dirty');
            expect(c2._foo).to.equal(1);
            expect(c2._bar).to.equal(2);
            expect(c2._hello).to.equal(false);
            expect(c2._dirty).to.equal(true);
        });
    });
});
