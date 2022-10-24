import type { JSONOutput } from 'typedoc';
import type { NamedTupleMemberType } from 'typedoc/dist/lib/serialization/schema';
import { ArrayTypeParser } from './ArrayTypeParser';
import { ConditionalTypeParser } from './ConditionalTypeParser';
import { IndexedAccessTypeParser } from './IndexedAccessTypeParser';
import { InferredTypeParser } from './InferredTypeParser';
import { IntersectionTypeParser } from './IntersectionTypeParser';
import { IntrinsicTypeParser } from './IntrinsicTypeParser';
import { LiteralTypeParser } from './LiteralTypeParser';
import { MappedTypeParser } from './MappedTypeParser';
import { NamedTupleMemberTypeParser } from './NamedTupleMemberTypeParser';
import { OptionalTypeParser } from './OptionalTypeParser';
import { PredicateTypeParser } from './PredicateTypeParser';
import { QueryTypeParser } from './QueryTypeParser';
import { ReferenceTypeParser } from './ReferenceTypeParser';
import { ReflectionTypeParser } from './ReflectionTypeParser';
import { RestTypeParser } from './RestTypeParser';
import { TemplateLiteralTypeParser } from './TemplateLiteralTypeParser';
import { TupleTypeParser } from './TupleTypeParser';
import { TypeOperatorTypeParser } from './TypeOperatorTypeParser';
import { UnionTypeParser } from './UnionTypeParser';
import { UnknownTypeParser } from './UnknownTypeParser';

/**
 * The base interface for all type parsers.
 * @since 1.0.0
 */
export interface TypeParser {
  /**
   * The kind of type this parser is for.
   * @since 1.0.0
   */
  kind: TypeParser.Kind;

  /**
   * The method to convert this type parser to a JSON compatible format.
   * @since 1.0.0
   */
  toJSON(): TypeParser.JSON;

  /**
   * The method to convert this type parser to a string.
   * @since 1.0.0
   */
  toString(): string;
}

export namespace TypeParser {
  /**
   * Generates a new {@link TypeParser} instance from the given data.
   * @since 1.0.0
   * @param type The type to generate the parser from.
   * @param  The  this parser belongs to.
   * @returns The generated parser.
   */
  export function generateFromTypeDoc(
    type:
      | (
          | JSONOutput.ArrayType
          | JSONOutput.ConditionalType
          | JSONOutput.IndexedAccessType
          | JSONOutput.InferredType
          | JSONOutput.IntersectionType
          | JSONOutput.IntrinsicType
          | JSONOutput.LiteralType
          | JSONOutput.OptionalType
          | JSONOutput.PredicateType
          | JSONOutput.QueryType
          | JSONOutput.ReferenceType
          | JSONOutput.ReflectionType
          | JSONOutput.RestType
          | JSONOutput.TupleType
          | JSONOutput.TypeOperatorType
          | JSONOutput.UnionType
          | JSONOutput.UnknownType
          | JSONOutput.MappedType
          | JSONOutput.TemplateLiteralType
          | NamedTupleMemberType
        )
      | JSONOutput.SomeType
  ): TypeParser {
    switch (type.type) {
      case 'array': {
        const { elementType } = type;

        return new ArrayTypeParser({ type: generateFromTypeDoc(elementType) });
      }

      case 'conditional': {
        const { checkType, extendsType, trueType, falseType } = type;

        return new ConditionalTypeParser({
          checkType: generateFromTypeDoc(checkType),
          extendsType: generateFromTypeDoc(extendsType),
          trueType: generateFromTypeDoc(trueType),
          falseType: generateFromTypeDoc(falseType)
        });
      }

      case 'indexedAccess': {
        const { objectType, indexType } = type;

        return new IndexedAccessTypeParser({
          objectType: generateFromTypeDoc(objectType),
          indexType: generateFromTypeDoc(indexType)
        });
      }

      case 'inferred': {
        const { name } = type;

        return new InferredTypeParser({ type: name });
      }

      case 'intersection': {
        const { types } = type;

        return new IntersectionTypeParser({ types: types.map((type) => generateFromTypeDoc(type)) });
      }

      case 'intrinsic': {
        const { name } = type;

        return new IntrinsicTypeParser({ type: name });
      }

      case 'literal': {
        const { value } = type;

        return new LiteralTypeParser({ value: (typeof value === 'object' && value !== null ? value.value : value)?.toString() ?? 'null' });
      }

      case 'mapped': {
        const { parameter, parameterType, nameType, templateType, optionalModifier, readonlyModifier } = type;

        return new MappedTypeParser({
          parameter,
          parameterType: generateFromTypeDoc(parameterType),
          nameType: nameType ? generateFromTypeDoc(nameType) : null,
          templateType: generateFromTypeDoc(templateType),
          optional: (optionalModifier ?? null) as MappedTypeParser.Modifier,
          readonly: (readonlyModifier ?? null) as MappedTypeParser.Modifier
        });
      }

      case 'named-tuple-member': {
        const { element, isOptional, name } = type;

        return new NamedTupleMemberTypeParser({
          name,
          type: generateFromTypeDoc(element),
          optional: isOptional ?? false
        });
      }

      case 'optional': {
        const { elementType } = type;

        return new OptionalTypeParser({ type: generateFromTypeDoc(elementType) });
      }

      case 'predicate': {
        const { asserts, name, targetType } = type;

        return new PredicateTypeParser({
          asserts,
          name,
          type: targetType ? generateFromTypeDoc(targetType) : null
        });
      }

      case 'query': {
        const { queryType } = type;

        return new QueryTypeParser({ query: generateFromTypeDoc(queryType) as ReferenceTypeParser });
      }

      case 'reference': {
        const { id, name, package: _package, qualifiedName, typeArguments = [] } = type;

        return new ReferenceTypeParser({
          id: id ?? null,
          name: qualifiedName ?? name,
          packageName: _package ?? null,
          typeArguments: typeArguments.map((type) => generateFromTypeDoc(type))
        });
      }

      case 'reflection': {
        const { declaration } = type;

        return new ReflectionTypeParser({ reflection: declaration ?? null });
      }

      case 'rest': {
        const { elementType } = type;

        return new RestTypeParser({ type: generateFromTypeDoc(elementType) });
      }

      case 'template-literal': {
        const { head, tail } = type;

        return new TemplateLiteralTypeParser({
          head,
          tail: tail.map(([type, text]) => ({ type: generateFromTypeDoc(type), text }))
        });
      }

      case 'tuple': {
        const { elements = [] } = type;

        return new TupleTypeParser({ types: elements.map((type) => generateFromTypeDoc(type)) });
      }

      case 'typeOperator': {
        const { operator, target } = type;

        return new TypeOperatorTypeParser({
          operator: operator as TypeOperatorTypeParser.Operator,
          type: generateFromTypeDoc(target)
        });
      }

      case 'union': {
        const { types } = type;

        return new UnionTypeParser({ types: types.map((type) => generateFromTypeDoc(type)) });
      }

      case 'unknown': {
        const { name } = type;

        return new UnknownTypeParser({ name });
      }
    }
  }

  /**
   * Generates a new {@link TypeParser} instance from the given data.
   * @param json The json to generate the parser from.
   * @returns The generated parser.
   */
  export function generateFromJSON(json: JSON): TypeParser {
    switch (json.kind) {
      case Kind.Array: {
        const { type } = json as ArrayTypeParser.JSON;

        return new ArrayTypeParser({ type: generateFromJSON(type) });
      }

      case Kind.Conditional: {
        const { checkType, extendsType, trueType, falseType } = json as ConditionalTypeParser.JSON;

        return new ConditionalTypeParser({
          checkType: generateFromJSON(checkType),
          extendsType: generateFromJSON(extendsType),
          trueType: generateFromJSON(trueType),
          falseType: generateFromJSON(falseType)
        });
      }

      case Kind.IndexedAccess: {
        const { objectType, indexType } = json as IndexedAccessTypeParser.JSON;

        return new IndexedAccessTypeParser({
          objectType: generateFromJSON(objectType),
          indexType: generateFromJSON(indexType)
        });
      }

      case Kind.Inferred: {
        const { type } = json as InferredTypeParser.JSON;

        return new InferredTypeParser({ type });
      }

      case Kind.Intersection: {
        const { types } = json as IntersectionTypeParser.JSON;

        return new IntersectionTypeParser({ types: types.map((type) => generateFromJSON(type)) });
      }

      case Kind.Intrinsic: {
        const { type } = json as IntrinsicTypeParser.JSON;

        return new IntrinsicTypeParser({ type });
      }

      case Kind.Literal: {
        const { value } = json as LiteralTypeParser.JSON;

        return new LiteralTypeParser({ value });
      }

      case Kind.Mapped: {
        const { parameter, parameterType, nameType, templateType, optional, readonly } = json as MappedTypeParser.JSON;

        return new MappedTypeParser({
          parameter,
          parameterType: generateFromJSON(parameterType),
          nameType: nameType ? generateFromJSON(nameType) : null,
          templateType: generateFromJSON(templateType),
          optional,
          readonly
        });
      }

      case Kind.NamedTupleMember: {
        const { type, optional, name } = json as NamedTupleMemberTypeParser.JSON;

        return new NamedTupleMemberTypeParser({ name, type: generateFromJSON(type), optional });
      }

      case Kind.Optional: {
        const { type } = json as OptionalTypeParser.JSON;

        return new OptionalTypeParser({ type: generateFromJSON(type) });
      }

      case Kind.Predicate: {
        const { asserts, name, type } = json as PredicateTypeParser.JSON;

        return new PredicateTypeParser({ asserts, name, type: type ? generateFromJSON(type) : null });
      }

      case Kind.Query: {
        const { query } = json as QueryTypeParser.JSON;

        return new QueryTypeParser({ query: generateFromJSON(query) as ReferenceTypeParser });
      }

      case Kind.Reference: {
        const { id, name, packageName, typeArguments } = json as ReferenceTypeParser.JSON;

        return new ReferenceTypeParser({
          id,
          name,
          packageName: packageName ?? null,
          typeArguments: typeArguments.map((type) => generateFromJSON(type))
        });
      }

      case Kind.Reflection: {
        const { reflection } = json as ReflectionTypeParser.JSON;

        return new ReflectionTypeParser({ reflection });
      }

      case Kind.Rest: {
        const { type } = json as RestTypeParser.JSON;

        return new RestTypeParser({ type: generateFromJSON(type) });
      }

      case Kind.TemplateLiteral: {
        const { head, tail } = json as TemplateLiteralTypeParser.JSON;

        return new TemplateLiteralTypeParser({
          head,
          tail: tail.map((tail) => ({ type: generateFromJSON(tail.type), text: tail.text }))
        });
      }

      case Kind.Tuple: {
        const { types } = json as TupleTypeParser.JSON;

        return new TupleTypeParser({ types: types.map((type) => generateFromJSON(type)) });
      }

      case Kind.TypeOperator: {
        const { operator, type } = json as TypeOperatorTypeParser.JSON;

        return new TypeOperatorTypeParser({ operator, type: generateFromJSON(type) });
      }

      case Kind.Union: {
        const { types } = json as UnionTypeParser.JSON;

        return new UnionTypeParser({ types: types.map((type) => generateFromJSON(type)) });
      }

      case Kind.Unknown: {
        const { name } = json as UnknownTypeParser.JSON;

        return new UnknownTypeParser({ name });
      }
    }
  }

  /**
   * Wraps the given type parser depending on it's binding power.
   * @since 1.0.0
   * @param type The type parser to wrap.
   * @param binding The binding power of the type parser.
   * @returns The wrapped type parser.
   */
  export function wrap(type: TypeParser, binding: number) {
    return BindingPowers[type.kind] < binding ? `(${type.toString()})` : type.toString();
  }

  /**
   * The kind of type parser.
   * @since 1.0.0
   */
  export enum Kind {
    Array = 'array',

    Conditional = 'conditional',

    IndexedAccess = 'indexedAccess',

    Inferred = 'inferred',

    Intersection = 'intersection',

    Intrinsic = 'intrinsic',

    Literal = 'literal',

    Mapped = 'mapped',

    NamedTupleMember = 'namedTupleMember',

    Optional = 'optional',

    Predicate = 'predicate',

    Query = 'query',

    Reference = 'reference',

    Reflection = 'reflection',

    Rest = 'rest',

    TemplateLiteral = 'templateLiteral',

    Tuple = 'tuple',

    TypeOperator = 'typeOperator',

    Union = 'union',

    Unknown = 'unknown'
  }

  /**
   * The binding powers of the type parsers.
   * @since 1.0.0
   */
  export const BindingPowers: Record<Kind, number> = {
    [Kind.Array]: 999,
    [Kind.Conditional]: 150,
    [Kind.IndexedAccess]: 999,
    [Kind.Inferred]: 999,
    [Kind.Intersection]: 120,
    [Kind.Intrinsic]: 999,
    [Kind.Literal]: 999,
    [Kind.Mapped]: 999,
    [Kind.NamedTupleMember]: 999,
    [Kind.Optional]: 999,
    [Kind.Predicate]: 999,
    [Kind.Query]: 900,
    [Kind.Reference]: 999,
    [Kind.Reflection]: 999,
    [Kind.Rest]: 999,
    [Kind.TemplateLiteral]: 999,
    [Kind.Tuple]: 999,
    [Kind.TypeOperator]: 900,
    [Kind.Union]: 100,
    [Kind.Unknown]: -1
  };

  /**
   * The base interface for the JSON compatible format of type parsers.
   * @since 1.0.0
   */
  export interface JSON {
    /**
     * The kind of type parser this is.
     * @since 1.0.0
     */
    kind: Kind;
  }
}
