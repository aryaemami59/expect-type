import type {IsNever, StrictEqualUsingTSInternalIdenticalToOperator} from './utils'

// prettier-ignore
/**
 * The simple(ish) way to get overload info from a function
 * {@linkcode FunctionType}. Recent versions of typescript will match any
 * function against a generic 10-overload type, filling in slots with
 * duplicates of the function. So, we can just match against a single type and
 * get all the overloads.
 *
 * For older versions of TypeScript, we'll need to painstakingly do ten
 * separate matches.
 */
export type TSPost53OverloadsInfoTuple<FunctionType> =
  FunctionType extends {(...args: infer A1): infer R1; (...args: infer A2): infer R2; (...args: infer A3): infer R3; (...args: infer A4): infer R4; (...args: infer A5): infer R5; (...args: infer A6): infer R6; (...args: infer A7): infer R7; (...args: infer A8): infer R8; (...args: infer A9): infer R9; (...args: infer A10): infer R10}
  ? [{parameters: A1; return: R1}, {parameters: A2; return: R2}, {parameters: A3; return: R3}, {parameters: A4; return: R4}, {parameters: A5; return: R5}, {parameters: A6; return: R6}, {parameters: A7; return: R7}, {parameters: A8; return: R8}, {parameters: A9; return: R9}, {parameters: A10; return: R10}, ]
  : never

export type BaseOverloadInfo = {parameters: unknown[]; return: unknown}

/**
 * `true` if {@linkcode Tuple} is equivalent to
 * `{parameters: unknown[]; return: unknown}`, which is what an overload info
 * object looks like for a non-existent overload. This is useful because
 * older versions of TypeScript end up with 9 "useless" overloads and
 * one real one for parameterless/generic functions.
 */
export type IsUselessOverloadInfo<Tuple> = StrictEqualUsingTSInternalIdenticalToOperator<Tuple, BaseOverloadInfo>

// prettier-ignore
/**
 * For older versions of TypeScript, we need two separate workarounds to get
 * overload info. First, we need need to use
 * {@linkcode DecreasingOverloadsInfoTuple} to get the overload info for
 * functions with 1-10 overloads. Then, we need to filter out the "useless"
 * overloads that are present in older versions of TypeScript,
 * for parameterless functions. To do this we check
 * if {@linkcode FunctionType} is parameterless,
 * then use {@linkcode IsUselessOverloadInfo} to replace useless overloads with
 * the parameterless overload.
 */
export type TSPre53OverloadsInfoTuple<FunctionType> = FunctionType extends (...args: infer Args) => infer Return
  ? DecreasingOverloadsInfoTuple<FunctionType> extends infer Tuple
    ? Extract<
        {
          [Index in keyof Tuple]:
            IsUselessOverloadInfo<Tuple[Index]> extends true
              ? {parameters: Args; return: Return}
              : Tuple[Index]
        },
        Array<{parameters: unknown[]; return: unknown}>
      >
    : never
  : DecreasingOverloadsInfoTuple<FunctionType>

// prettier-ignore
/**
 * For versions of TypeScript below 5.3, we need to check for 10 overloads,
 * then 9, then 8, etc., to get a tuple of the overload info objects.
 */
export type DecreasingOverloadsInfoTuple<FunctionType> = FunctionType extends {(...args: infer A1): infer R1; (...args: infer A2): infer R2; (...args: infer A3): infer R3; (...args: infer A4): infer R4; (...args: infer A5): infer R5; (...args: infer A6): infer R6; (...args: infer A7): infer R7; (...args: infer A8): infer R8; (...args: infer A9): infer R9; (...args: infer A10): infer R10}
  ? [{parameters: A1; return: R1}, {parameters: A2; return: R2}, {parameters: A3; return: R3}, {parameters: A4; return: R4}, {parameters: A5; return: R5}, {parameters: A6; return: R6}, {parameters: A7; return: R7}, {parameters: A8; return: R8}, {parameters: A9; return: R9}, {parameters: A10; return: R10}, ]
  : FunctionType extends {(...args: infer A1): infer R1; (...args: infer A2): infer R2; (...args: infer A3): infer R3; (...args: infer A4): infer R4; (...args: infer A5): infer R5; (...args: infer A6): infer R6; (...args: infer A7): infer R7; (...args: infer A8): infer R8; (...args: infer A9): infer R9; }
    ? [{parameters: A1; return: R1}, {parameters: A2; return: R2}, {parameters: A3; return: R3}, {parameters: A4; return: R4}, {parameters: A5; return: R5}, {parameters: A6; return: R6}, {parameters: A7; return: R7}, {parameters: A8; return: R8}, {parameters: A9; return: R9}, ]
    : FunctionType extends {(...args: infer A1): infer R1; (...args: infer A2): infer R2; (...args: infer A3): infer R3; (...args: infer A4): infer R4; (...args: infer A5): infer R5; (...args: infer A6): infer R6; (...args: infer A7): infer R7; (...args: infer A8): infer R8; }
      ? [{parameters: A1; return: R1}, {parameters: A2; return: R2}, {parameters: A3; return: R3}, {parameters: A4; return: R4}, {parameters: A5; return: R5}, {parameters: A6; return: R6}, {parameters: A7; return: R7}, {parameters: A8; return: R8}, ]
      : FunctionType extends {(...args: infer A1): infer R1; (...args: infer A2): infer R2; (...args: infer A3): infer R3; (...args: infer A4): infer R4; (...args: infer A5): infer R5; (...args: infer A6): infer R6; (...args: infer A7): infer R7; }
        ? [{parameters: A1; return: R1}, {parameters: A2; return: R2}, {parameters: A3; return: R3}, {parameters: A4; return: R4}, {parameters: A5; return: R5}, {parameters: A6; return: R6}, {parameters: A7; return: R7}, ]
        : FunctionType extends {(...args: infer A1): infer R1; (...args: infer A2): infer R2; (...args: infer A3): infer R3; (...args: infer A4): infer R4; (...args: infer A5): infer R5; (...args: infer A6): infer R6; }
          ? [{parameters: A1; return: R1}, {parameters: A2; return: R2}, {parameters: A3; return: R3}, {parameters: A4; return: R4}, {parameters: A5; return: R5}, {parameters: A6; return: R6}, ]
          : FunctionType extends {(...args: infer A1): infer R1; (...args: infer A2): infer R2; (...args: infer A3): infer R3; (...args: infer A4): infer R4; (...args: infer A5): infer R5; }
            ? [{parameters: A1; return: R1}, {parameters: A2; return: R2}, {parameters: A3; return: R3}, {parameters: A4; return: R4}, {parameters: A5; return: R5}, ]
            : FunctionType extends {(...args: infer A1): infer R1; (...args: infer A2): infer R2; (...args: infer A3): infer R3; (...args: infer A4): infer R4; }
              ? [{parameters: A1; return: R1}, {parameters: A2; return: R2}, {parameters: A3; return: R3}, {parameters: A4; return: R4}, ]
              : FunctionType extends {(...args: infer A1): infer R1; (...args: infer A2): infer R2; (...args: infer A3): infer R3; }
                ? [{parameters: A1; return: R1}, {parameters: A2; return: R2}, {parameters: A3; return: R3}]
                : FunctionType extends {(...args: infer A1): infer R1; (...args: infer A2): infer R2; }
                  ? [{parameters: A1; return: R1}, {parameters: A2; return: R2}]
                  : FunctionType extends (...args: infer A1) => infer R1 ? [{parameters: A1; return: R1}]
                    : never

/**
 * Get a tuple of overload info objects for a function {@linkcode FunctionType}.
 * Does a check for whether we can do
 * the one-shot 10-overload matcher (which works for ts>5.3), and if not,
 * falls back to the more complicated utility.
 */
export type OverloadsInfoTuple<FunctionType> =
  // recent typescript versions (5.3+) can treat a 1-overload type function as a 10-overload. Test for this by seeing if we can successfully get a 10-tuple from a 1-overload function. If we can't, we're on an old typescript and need to use the more complicated utility.
  IsNever<TSPost53OverloadsInfoTuple<(a: 1) => 2>> extends true
    ? TSPre53OverloadsInfoTuple<FunctionType>
    : TSPost53OverloadsInfoTuple<FunctionType>

/**
 * A union type of the parameters allowed for any overload of
 * function {@linkcode FunctionType}.
 */
export type OverloadParameters<FunctionType> = OverloadsInfoTuple<FunctionType>[number]['parameters']

/**
 * A union type of the return types for any overload of
 * function {@linkcode FunctionType}.
 */
export type OverloadReturnTypes<FunctionType> = OverloadsInfoTuple<FunctionType>[number]['return']

/**
 * Takes an overloads info {@linkcode Tuple},
 * produced from {@linkcode OverloadsInfoTuple} and rejects the ones
 * incompatible with {@linkcode FunctionArguments}.
 */
export type SelectOverloadsInfo<Tuple extends BaseOverloadInfo[], FunctionArguments extends unknown[]> = {
  [Index in keyof Tuple]: FunctionArguments extends Tuple[Index]['parameters'] ? Tuple[Index] : never
}

export type SelectOverloadParameters<FunctionType, FunctionArguments extends unknown[]> = SelectOverloadsInfo<
  OverloadsInfoTuple<FunctionType>,
  FunctionArguments
>[number]['parameters']

// prettier-ignore
/** Gets the matching return type from a parameters-type (usually a tuple) */
export type OverloadReturnTypeForParameters<FunctionType, FunctionArguments extends unknown[]> =
  SelectOverloadsInfo<OverloadsInfoTuple<FunctionType>, FunctionArguments>[number]['return']
