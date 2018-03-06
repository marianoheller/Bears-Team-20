import signupReducer from './signup';
import * as actions from '../actions/signup';


const initialState = {
    isFetching: false,
    pause: false,
    errors: {},
  };
  
  

describe('signup reducer', () => {
    
    let state;

    beforeEach(() => {
        state = {
          isFetching: false,
          pause: false,
          errors: {},
        };
        
    }) 

    it('should return the same state if invalid action type', () => {
        expect(signupReducer(state, { type: 'INVALID ACTION' })).toEqual(state);
    })

    it('should set isFetching to true on SIGNUP_REQUEST', () => {
        expect(signupReducer(state, actions.signupRequest({}))).toEqual({
            ...state,
            isFetching: true
        });
    })

    it('should set errors and pause on SIGNUP_FAILED', () => {
        const errors = {
            a: "asd", b: 3, c: 312.3
        }
        expect(signupReducer(state, actions.signupFailed(errors))).toEqual({
            ...state,
            pause: true,
            errors
        });
    })
})