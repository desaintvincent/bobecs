import Component from './../src/Component';
import { expect } from 'chai';
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
});
