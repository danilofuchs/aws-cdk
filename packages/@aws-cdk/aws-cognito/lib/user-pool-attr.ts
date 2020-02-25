/**
 * Standard attributes
 *
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#cognito-user-pools-standard-attributes
 */
export enum StandardAttrs {
  /**
   * End-User's preferred postal address.
   */
  ADDRESS = 'address',

  /**
   * End-User's birthday, represented as an ISO 8601:2004 [ISO8601‑2004] YYYY-MM-DD format.
   * The year MAY be 0000, indicating that it is omitted.
   * To represent only the year, YYYY format is allowed.
   */
  BIRTHDATE = 'birthdate',

  /**
   * End-User's preferred e-mail address.
   * Its value MUST conform to the RFC 5322 [RFC5322] addr-spec syntax.
   */
  EMAIL = 'email',

  /**
   * Surname(s) or last name(s) of the End-User.
   * Note that in some cultures, people can have multiple family names or no family name;
   * all can be present, with the names being separated by space characters.
   */
  FAMILY_NAME = 'family_name',

  /**
   * End-User's gender.
   */
  GENDER = 'gender',

  /**
   * Given name(s) or first name(s) of the End-User.
   * Note that in some cultures, people can have multiple given names;
   * all can be present, with the names being separated by space characters.
   */
  GIVEN_NAME = 'given_name',

  /**
   * End-User's locale, represented as a BCP47 [RFC5646] language tag.
   * This is typically an ISO 639-1 Alpha-2 [ISO639‑1] language code in lowercase
   * and an ISO 3166-1 Alpha-2 [ISO3166‑1] country code in uppercase, separated by a dash.
   * For example, en-US or fr-CA.
   */
  LOCALE = 'locale',

  /**
   * Middle name(s) of the End-User.
   * Note that in some cultures, people can have multiple middle names;
   * all can be present, with the names being separated by space characters.
   * Also note that in some cultures, middle names are not used.
   */
  MIDDLE_NAME = 'middle_name',

  /**
   * End-User's full name in displayable form including all name parts,
   * possibly including titles and suffixes, ordered according to the End-User's locale and preferences.
   */
  NAME = 'name',

  /**
   * Casual name of the End-User that may or may not be the same as the given_name.
   * For instance, a nickname value of Mike might be returned alongside a given_name value of Michael.
   */
  NICKNAME = 'nickname',

  /**
   * End-User's preferred telephone number.
   *
   * Phone numbers must follow these formatting rules: A phone number must start with a plus (+) sign, followed
   * immediately by the country code. A phone number can only contain the + sign and digits. You must remove any other
   * characters from a phone number, such as parentheses, spaces, or dashes (-) before submitting the value to the
   * service.
   */
  PHONE_NUMBER = 'phone_number',

  /**
   * URL of the End-User's profile picture.
   * This URL MUST refer to an image file (for example, a PNG, JPEG, or GIF image file),
   * rather than to a Web page containing an image.
   * Note that this URL SHOULD specifically reference a profile photo of the End-User
   * suitable for displaying when describing the End-User, rather than an arbitrary photo taken by the End-User
   */
  PICTURE = 'picture',

  /**
   * Shorthand name by which the End-User wishes to be referred to.
   */
  PREFERRED_USERNAME = 'preferred_username',

  /**
   * URL of the End-User's profile page. The contents of this Web page SHOULD be about the End-User.
   */
  PROFILE = 'profile',

  /**
   * The End-User's time zone
   */
  TIMEZONE = 'zoneinfo',

  /**
   * Time the End-User's information was last updated.
   * Its value is a JSON number representing the number of seconds from 1970-01-01T0:0:0Z
   * as measured in UTC until the date/time.
   */
  UPDATED_AT = 'updated_at',

  /**
   * URL of the End-User's Web page or blog.
   */
  WEBSITE = 'website'
}

/**
 * Represents a custom attribute type.
 */
export interface ICustomAttr {
  /**
   * Bind this custom attribute type to the values as expected by CloudFormation
   */
  bind(): CustomAttrConfig;
}

/**
 * Configuration that will be fed into CloudFormation for any custom attribute type.
 */
export interface CustomAttrConfig {
  // tslint:disable:max-line-length
  /**
   * The data type of the custom attribute.
   *
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SchemaAttributeType.html#CognitoUserPools-Type-SchemaAttributeType-AttributeDataType
   */
  readonly attrDataType: string;
  // tslint:enable:max-line-length

  /**
   * The constraints attached to this custom attribute.
   * The structure here would be the fragment of `CfnUserPool.SchemaAttributeProperty` associated with this data type.
   * For example, in the case of the 'String' data type, this would be `{ "stringAttributeConstraints": { "minLength": "..", "maxLength": ".." } }`.
   * @see https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SchemaAttributeType.html
   * @default - no constraints
   */
  readonly constraints?: { [key: string]: any };
}

/**
 * Props for constructing a StringAttr
 */
export interface StringAttrProps {
  /**
   * Minimum length of this attribute.
   * @default 0
   */
  readonly minLen?: number;

  /**
   * Maximum length of this attribute.
   * @default 2048
   */
  readonly maxLen?: number;
}

/**
 * The String custom attribute type.
 */
export class StringAttr implements ICustomAttr {
  private readonly minLen?: number;
  private readonly maxLen?: number;

  constructor(props: StringAttrProps = {}) {
    if (props.minLen && props.minLen < 0) {
      throw new Error(`minLen cannot be less than 0 (value: ${props.minLen}).`);
    }
    if (props.maxLen && props.maxLen > 2048) {
      throw new Error(`maxLen cannot be greater than 2048 (value: ${props.maxLen}).`);
    }
    this.minLen = props?.minLen;
    this.maxLen = props?.maxLen;
  }

  public bind(): CustomAttrConfig {
    const constraints = {
      stringAttributeConstraints: {
        minLength: this.minLen?.toString(),
        maxLength: this.maxLen?.toString(),
      }
    };

    return {
      attrDataType: 'String',
      constraints: (this.minLen || this.maxLen) ? constraints : undefined,
    };
  }
}

/**
 * Props for NumberAttr
 */
export interface NumberAttrProps {
  /**
   * Minimum value of this attribute.
   * @default - no minimum value
   */
  readonly min?: number;

  /**
   * Maximum value of this attribute.
   * @default - no maximum value
   */
  readonly max?: number;
}

/**
 * The Number custom attribute type.
 */
export class NumberAttr implements ICustomAttr {
  private readonly min?: number;
  private readonly max?: number;

  constructor(props: NumberAttrProps = {}) {
    this.min = props?.min;
    this.max = props?.max;
  }

  public bind(): CustomAttrConfig {
    const constraints = {
      numberAttributeConstraints: {
        minValue: this.min?.toString(),
        maxValue: this.max?.toString(),
      }
    };

    return {
      attrDataType: 'Number',
      constraints: (this.min || this.max) ? constraints : undefined,
    };
  }
}

/**
 * The Boolean custom attribute type.
 */
export class BooleanAttr implements ICustomAttr {
  public bind(): CustomAttrConfig {
    return {
      attrDataType: 'Boolean'
    };
  }
}

/**
 * The DateTime custom attribute type.
 */
export class DateTimeAttr implements ICustomAttr {
  public bind(): CustomAttrConfig {
    return {
      attrDataType: 'DateTime'
    };
  }
}