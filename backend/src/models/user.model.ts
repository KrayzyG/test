import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.config';
import bcrypt from 'bcrypt';

// User attributes interface
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  phone?: string;
  password_hash: string;
  profile_image?: string;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
  is_active: boolean;
  verification_token?: string;
  is_verified: boolean;
  reset_token?: string;
  reset_token_expires?: Date;
}

// User creation attributes interface (optional fields for creation)
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at' | 'is_active' | 'is_verified'> {}

// User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public phone?: string;
  public password_hash!: string;
  public profile_image?: string;
  public created_at!: Date;
  public updated_at!: Date;
  public last_login?: Date;
  public is_active!: boolean;
  public verification_token?: string;
  public is_verified!: boolean;
  public reset_token?: string;
  public reset_token_expires?: Date;

  // Helper method to check password
  public async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }

  // Helper method to hash password
  public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}

// Initialize User model
User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    profile_image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    verification_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    reset_token_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password_hash) {
          user.password_hash = await User.hashPassword(user.password_hash);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password_hash')) {
          user.password_hash = await User.hashPassword(user.password_hash);
        }
      },
    },
  }
);

export default User;
