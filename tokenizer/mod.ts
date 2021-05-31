export interface States {
  [name: string]: Rule;
}

export type Matcher = RuleOptions | string | string[] | RegExp;

export interface Rule {
  [name: string]: RuleOptions | string | string[] | RegExp;
}

export interface MatcherParams {
  name: string;
  options?: Partial<RuleOptions>;
}

export interface RuleOptions {
  match: string | RegExp | string[];
  ignore?: boolean;
  push?: string;
  pop?: number;
  value?: (data: string) => string;
}

export interface Token {
  type: string;
  value: string;
}

export class Tokenizer {
  private stack: string[] = [];
  private currentSetOfRules: Rule = {};
  private states: States = {};
  private tokens: Token[] = [];
  private pattern: string = "";

  constructor(states?: States) {
    if (typeof states !== "undefined") {
      this.setStates(states);
    }
  }

  public setStates(states: States) {
    const givenStates = Object.getOwnPropertyNames(states);
    if (givenStates.length < 0) {
      throw new Error("empty state");
    }
    const starterState = givenStates[0];
    this.states = states;
    this.stack = [starterState];
    this.currentSetOfRules = states[starterState];
  }

  public tokenize(pattern: string): Token[] {
    this.tokens = [];
    this.pattern = pattern;
    this.setStates(this.states);
    return this.internalTokenize();
  }

  private internalTokenize() {
    const state = this.currentSetOfRules;
    if (!Object.getOwnPropertyNames(state).length) {
      throw new Error("empty state");
    }
    if (this.pattern === "") {
      return this.tokens;
    }
    const stateRuleNames = Object.getOwnPropertyNames(state);
    for (let i = 0; i < stateRuleNames.length; i++) {
      const stateRuleName = stateRuleNames[i];
      const ruleOptions = state[stateRuleName];
      this.matchRouter(ruleOptions, stateRuleName);
    }
    if (this.pattern.length) {
      throw new Error(`syntax error near : '${this.pattern}'`);
    }
    return this.tokens;
  }

  private matchRouter(matcher: Matcher, name: string, options?: any) {
    if (typeof matcher === "string") {
      return this.matchString(matcher, {
        name,
        options,
      });
    } else if (matcher instanceof RegExp) {
      return this.matchRegex(matcher, {
        name,
        options,
      });
    } else if (Array.isArray(matcher)) {
      return this.matchArray(matcher, {
        name,
        options,
      });
    } else if (typeof matcher === "object") {
      return this.matchObject(matcher, {
        name,
        options: matcher,
      });
    }
  }

  private matchString(matcher: string, params: MatcherParams) {
    let { name, options } = params;
    if (this.pattern.indexOf(matcher) === 0) {
      this.storeToken(matcher, name, options);
      this.pattern = this.pattern.replace(matcher, "");
      return this.handleOptions(options);
    }
  }

  private matchRegex(matcher: RegExp, params: MatcherParams) {
    let { name, options } = params;
    const matchedValue = this.pattern.match(matcher as RegExp);
    if (
      matchedValue !== null &&
      matchedValue.length &&
      this.pattern.indexOf(matchedValue[0]) === 0
    ) {
      this.storeToken(matchedValue[0], name, options);
      this.pattern = this.pattern.replace(matchedValue[0], "");
      return this.handleOptions(options);
    }
  }

  private matchArray(matcher: string[], params: MatcherParams) {
    let { name, options } = params;
    for (let j = 0; j < matcher.length; j++) {
      const ruleMatcher = matcher[j];
      if (this.pattern.indexOf(ruleMatcher) === 0) {
        this.storeToken(ruleMatcher, name, options);
        this.pattern = this.pattern.replace(ruleMatcher, "");
        return this.handleOptions(options);
      }
    }
  }

  private matchObject(
    matcher: RuleOptions,
    params: MatcherParams,
  ): Token[] | void {
    let { name, options } = params;
    return this.matchRouter(matcher.match, name, options);
  }

  private handleOptions(options?: Partial<RuleOptions>) {
    if (typeof options === "undefined") {
      return this.internalTokenize();
    }
    if (options.push) {
      this.stack.push(options.push);
      if (typeof this.states[options.push] === "undefined") {
        throw new Error(`no state found : ${options.push}`);
      }
      this.currentSetOfRules = this.states[options.push];
    } else if (options.pop) {
      if (this.stack.length === 1) {
        throw new Error("there are no state to pop");
      }
      this.stack.pop();
      this.currentSetOfRules = this.states[this.stack[this.stack.length - 1]];
    }
    return this.internalTokenize();
  }

  private storeToken(
    value: string,
    type: string,
    options?: Partial<RuleOptions>,
  ) {
    if (options && options.ignore) return;
    if (options && options.value) {
      return this.tokens.push({ type, value: options.value(value) });
    }
    this.tokens.push({ type, value });
  }
}
